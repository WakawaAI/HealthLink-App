# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
app.config['SECRET_KEY'] = 'your_super_secret_key' # Used to sign the JWT tokens
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///healthlink.db' # Creates a local SQLite file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- SQL DATABASE MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False) # In production, hash this with bcrypt!

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.String(255), nullable=False)

# --- AUTHENTICATION MIDDLEWARE ---
# This decorator ensures a user is logged in before they can access certain routes
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if the token is passed in the headers (from api-config.js)
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Removes "Bearer "
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode token to get the user ID
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid or expired!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- ROUTES ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered.'}), 400

    new_user = User(name=data['name'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registration successful!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()

    if user:
        # Generate a token that expires in 24 hours, embedding the exact user ID
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid email or password.'}), 401

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    # Returns the dynamic username of the logged-in individual for the dashboard
    return jsonify({'username': current_user.name}), 200

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    # Format the SQL data into a JSON list
    output = []
    for doctor in doctors:
        output.append({
            'id': doctor.id,
            'last_name': doctor.last_name,
            'specialty': doctor.specialty
        })
    return jsonify(output), 200

@app.route('/api/appointments', methods=['POST'])
@token_required
def schedule_appointment(current_user):
    data = request.json
    new_appt = Appointment(
        user_id=current_user.id,
        doctor_id=data['doctorId'],
        date=data['date'],
        reason=data['reason']
    )
    db.session.add(new_appt)
    db.session.commit()
    return jsonify({'message': 'Appointment scheduled!'}), 201

# --- DATABASE INITIALIZATION ---
def initialize_database():
    with app.app_context():
        db.create_all()
        # Add some initial doctors to the SQL database if it's empty
        if not Doctor.query.first():
            doctors = [
                Doctor(last_name="Patel", specialty="Cardiology"),
                Doctor(last_name="Davis", specialty="Neurology"),
                Doctor(last_name="Lee", specialty="Anesthesiology")
            ]
            db.session.bulk_save_objects(doctors)
            db.session.commit()
            print("Database initialized with default doctors.")

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True, port=5000)