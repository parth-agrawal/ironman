# Iron Man 🦾

A CLI utility that generates visual whiteboard representations of your codebase using AI analysis. Transform complex project structures into intuitive, interactive canvas diagrams.

## Overview

Iron Man analyzes your project directory and creates a visual whiteboard that maps out your codebase structure, showing relationships between files, components, and modules. The generated whiteboard uses the JSON Canvas format, making it compatible with tools like Obsidian Canvas.

## Features

- 📊 **Visual Codebase Mapping**: Automatically generates whiteboard diagrams from your project structure
- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI to understand code relationships and create meaningful visualizations
- 📁 **Directory Processing**: Analyzes entire project directories with intelligent file filtering
- 🎨 **Interactive Canvas**: Outputs JSON Canvas format for use with compatible visualization tools
- ⚡ **Fast Processing**: Built with Node.js for optimal performance

## Prerequisites

- Node.js (v18 or higher)
- npm
- Google Generative AI API key

## Installation

```bash
npm install
```

## Setup

1. Create a `.env` file in the project root:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

2. Get your Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Usage

```bash
npm run build
iron-man [target-directory]
```

The tool will:

1. 📦 Pack and analyze your project files
2. 🤖 Send the codebase to AI for structural analysis
3. 🎨 Generate a visual whiteboard representation
4. 💾 Save the result as `whiteboard.canvas` in your target directory

## Output

The generated `whiteboard.canvas` file contains:

- **Nodes**: Representing files, components, and logical groupings
- **Edges**: Showing relationships and dependencies between elements
- **Spatial Layout**: Organized positioning for optimal visual understanding

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Repomix](https://github.com/yamadashy/repomix) - Project file processing
- [Google Gemini AI](https://ai.google.dev/) - Intelligent code analysis
- [AI SDK](https://sdk.vercel.ai/) - AI integration framework
