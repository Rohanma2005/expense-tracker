from flask import Flask
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
        
    from routes import api
    app.register_blueprint(api, url_prefix='/api')
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
