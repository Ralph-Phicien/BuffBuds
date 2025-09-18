from flask import Flask

def create_app():
    app = Flask(__name__)
    
    try:
        print("\nCREATING APP...")

    except Exception as e:
        print(f"Error creating app: {e}")

    return app
