from flask import Blueprint, request, jsonify
from models import db, User, ExpenseCategory, Expense
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func
import datetime

api = Blueprint('api', __name__)

@api.route('/auth/register', methods=['POST'])
def register():
    # Need to import bcrypt locally to avoid circular import at the top level
    from app import bcrypt 
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "Email already exists"}), 400
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"msg": "Username already exists"}), 400
        
    hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    
    new_user = User(
        username=data.get('username'),
        email=data.get('email'),
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@api.route('/auth/login', methods=['POST'])
def login():
    from app import bcrypt
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data.get('password')):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token, 
            "user": {
                "id": user.id, 
                "username": user.username, 
                "email": user.email,
                "monthly_budget": user.monthly_budget
            }
        }), 200
        
    return jsonify({"msg": "Invalid credentials"}), 401

@api.route('/user/budget', methods=['GET', 'POST'])
@jwt_required()
def handle_budget():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if request.method == 'POST':
        data = request.get_json()
        budget = data.get('monthly_budget')
        if budget is not None:
            user.monthly_budget = float(budget)
            db.session.commit()
            return jsonify({"msg": "Budget updated successfully", "monthly_budget": user.monthly_budget}), 200
        return jsonify({"msg": "No budget provided"}), 400
        
    return jsonify({"monthly_budget": user.monthly_budget}), 200

@api.route('/categories', methods=['GET', 'POST'])
@jwt_required()
def handle_categories():
    current_user_id = int(get_jwt_identity())
    
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        if not name:
            return jsonify({"msg": "Category name is required"}), 400
            
        new_category = ExpenseCategory(user_id=current_user_id, name=name)
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"id": new_category.id, "name": new_category.name}), 201
        
    categories = ExpenseCategory.query.filter_by(user_id=current_user_id).all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories]), 200

@api.route('/expenses', methods=['GET', 'POST'])
@jwt_required()
def handle_expenses():
    current_user_id = int(get_jwt_identity())
    
    if request.method == 'POST':
        data = request.get_json()
        category_id = data.get('category_id')
        amount = data.get('amount')
        description = data.get('description', '')
        date_str = data.get('date') # Expected YYYY-MM-DD format if provided
        
        if not category_id or not amount:
            return jsonify({"msg": "Category ID and amount are required"}), 400
            
        expense_date = datetime.datetime.utcnow()
        if date_str:
            # Parse provided date
            try:
                expense_date = datetime.datetime.strptime(date_str, '%Y-%m-%d')
            except ValueError:
                return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
                
        new_expense = Expense(
            user_id=current_user_id,
            category_id=category_id,
            amount=float(amount),
            description=description,
            date=expense_date
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"msg": "Expense added successfully", "expense_id": new_expense.id}), 201
        
    expenses = Expense.query.filter_by(user_id=current_user_id).order_by(Expense.date.desc()).all()
    result = []
    for e in expenses:
        result.append({
            "id": e.id,
            "category_id": e.category_id,
            "category_name": e.category.name,
            "amount": e.amount,
            "description": e.description,
            "date": e.date.strftime('%Y-%m-%d')
        })
    return jsonify(result), 200

@api.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    current_user_id = int(get_jwt_identity())
    
    # Get current month
    now = datetime.datetime.utcnow()
    current_month = now.month
    current_year = now.year
    
    # query expenses for current month for the user
    expenses = Expense.query.filter(
        Expense.user_id == current_user_id,
        db.extract('year', Expense.date) == current_year,
        db.extract('month', Expense.date) == current_month
    ).all()
    
    total_spent = 0
    category_totals = {}
    
    for e in expenses:
        total_spent += e.amount
        cat_name = e.category.name
        category_totals[cat_name] = category_totals.get(cat_name, 0) + e.amount
        
    user = User.query.get(current_user_id)
    budget = user.monthly_budget or 0
    remaining = budget - total_spent if budget > 0 else 0
    
    return jsonify({
        "total_spent": total_spent,
        "monthly_budget": budget,
        "remaining_budget": remaining,
        "category_totals": category_totals
    }), 200
