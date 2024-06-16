# translation_game [WIP]
Translation Video Game App [WIP]

To manage Python dependencies for your project, you can use a `pyproject.toml` file. This file is commonly used with the `poetry` package manager.

## Getting Started

To get started, you'll need to install `poetry` by running the following command in your terminal:

```
pip install poetry
```

Once `poetry` is installed, navigate to the root directory of your project (`/Users/hyunjaemoon/Workspaces/side-project/translation_game`) and run the following command to initialize a new `pyproject.toml` file:

```
poetry init
```

This command will guide you through a series of prompts to set up your project. You can specify your project name, version, description, author, and other details.

After the initialization is complete, you can start adding your Python dependencies to the `pyproject.toml` file. You can do this manually by editing the file or by using the `poetry add` command followed by the package name. For example, to add the `requests` package, you can run:

```
poetry add requests
```

This will automatically update the `pyproject.toml` file with the new dependency.

To install all the dependencies listed in the `pyproject.toml` file, you can run:

```
poetry install
```

This will create a virtual environment and install all the required packages.

Remember to commit the `pyproject.toml` file to your version control system so that other developers can easily set up the project with the correct dependencies.

If you want to play the game, first provide your own Gemini API key in a `.env` file with the following format:
```
GEMINI_API_KEY=<Your Gemini API key>
```

Run the game.

```
python translation_game/main.py
```

I hope this helps! Let me know if you have any further questions.