# Bags List: Nova

## Description
What is Nova? Nova is a simple bag listing website that displays a collection of bags from different luxury brands which are retrieved from an API.

## Features

### Hero Section 
Users are greeted with a hero section that fills the entire screen until scrolled.

### Bag List
The website features a list of bags with a view details button for more information about the bags.

### Bag Details
Users can view detailed information about the bags listed by the API.

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

Nova connects to a FastAPI backend to retrieve information about the bags used in the website.

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

### How Does Nova Use the Data?

Nova uses the retrieved API data to dynamically create bag listings on the website.

Information about the bags are displayed in each listing.

When the user selects View Details, additional information about the sleected bag is displayed as a pop up.



## How the List Works

When the website loads, Nova retrieves the available bags from the Bags API.

the returned bag data is stored in the allBags variable. Javascript then loops through the bags and creates a card for each bag.

Each card contains a basic information and a detailed inforamtion from the View Details button.

When the user clicks it, the bag's ID is used to request its information from the API. The additional information are displayed as a pop up


## Project Structure
Nova
    index.html
    style.css
    app.js
    images
        [bag_images]
    readme.md
    bag-hero.png
    favicon.png