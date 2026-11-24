# Personality Quiz: BagItUp - What Bag Type Are You?

## Description

What is BagItUp? BagItUp is a silly personality quiz that asks users a set of questions, with each answer representing a different bag personality that may match the user.

Its purpose is simply to have fun, similar to other personality quizzes found on the internet.

## Features

### 12 Different Questions
The quiz contains 12 questions, each with four possible answers.

### 7 Bag Personality Types
Users can receive one of seven bag personality types: Handbag, Shoulder Bag, Tote Bag, Crossbody, Backpack, Satchel, or Mini Bag.

### Dynamic Results
The user's result is dynamically generated based on their quiz answers and includes the corresponding bag type and personality description.

### Related Bag Recommendations
The website displays bags that match the user's personality result.

### Bag Details
Users can view detailed information about the bags recommended for their bag personality through a pop-up window.

## Technologies Used

- HTML for the structure of the website
- CSS for the user interface and visual design
- JavaScript for interactivity and functionality
- Python and FastAPI for the backend API
- Google Fonts (Playfair Display and DM Sans)
- Bags API for the bag information used by the website
- Vercel for deployment
- GitHub for source code management

## API Usage

### Connecting to the Bags API

BagItUp connects to a FastAPI backend to retrieve information about the bags used in the website.

The API address is stored in the JavaScript file and is used to request bag data from the backend.

### API Configuration and Authentication

The backend contains three separate API keys.

The website uses an API key when communicating with the FastAPI backend.

The backend checks whether the API key provided by the website matches one of its valid keys before granting access to the bag data.

### Loading the Bag Data

When the website starts, the `loadBags()` function sends a request to the `/bags` endpoint.

The API returns the available bags in JSON format, and the data is stored in the `allBags` variable.

This data is used to display related bags and their information throughout the website.

### Retrieving Individual Bags

When the user clicks **View Details**, the website sends a request to the `/bags/{id}` endpoint.

The API returns the information for the selected bag, which is then displayed as a pop-up window.

### How Does BagItUp Use the Data?

BagItUp uses the retrieved data to dynamically display information such as the bag's name, brand, price, rating, collection, type, and other details.

The bags displayed on the result page are filtered according to the bag personality type the user receives from the quiz.

## How the Quiz Works

The user is first presented with a simple start screen that introduces the personality quiz.

After clicking the Start button, the user is presented with a set of 12 questions, each containing four answers with different personalities that may resonate with the user.

The user cannot move forward with the quiz unless they answer the current quiz otherwise, they will be presented with an alert message to do so.

BagItUp uses a point system where each answer is assigned to a specific bag type. When an answer is selected, that bag type receives one point.

Once the user finishes the quiz, the bag type with the highest number of accumulated points is displayed as the result.

The result screen features the user's bag type, its corresponding personality description, and related bags retrieved from the Bags API.

The user may also choose to restart the quiz and take it again.

## Project Structure
BagItUp
    index.html
    style.css
    script.js
    questions.js
    images
        [bag_images]
    readme.md