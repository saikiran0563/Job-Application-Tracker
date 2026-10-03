from flask import Flask, jsonify

from config import Config
from extensions import db, cors, jwt


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app)
    jwt.init_app(app)

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
    app.run(debug=True)