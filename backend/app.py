import os

from flask import Flask, jsonify

from config import Config
from extensions import db, cors, jwt
from job_routes import job_bp
from analytics_routes import analytics_bp
from auth_routes import auth_bp


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
    )
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(analytics_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    # Health check endpoint
    @app.get("/api/health")
    def health_check():
        return jsonify({
            "status": "success",
            "message": "Job Application Tracker API is running"
        })

    return app


app = create_app()


if __name__ == "__main__":
    debug_enabled = os.getenv("FLASK_DEBUG", "").strip().lower() in {
        "1",
        "true",
        "yes",
    }
    app.run(debug=debug_enabled)
