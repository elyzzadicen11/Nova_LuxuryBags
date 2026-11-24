# Totetally - Bag Comparison Website

## Description

What is Totetally? Totetally is a bag comparison website that allows users to select and compare up to three bags at once. It retrieves bag information from a FastAPI backend and displays the selected bags through comparison slots, pop-ups, and a comparison table.

Its purpose is to help users to compare bags and help with decision-making.

## Features

### 3 Bag Selection
Users can select up to three bags from the selection dropdown.

### Comparison Table
Users can see the displayed information on the comparison table once they have selected their bags.

### Comparison Table Filter
Users can filter the table by Basic Information, Design and Appearance, Materials, and Reviews if ever they want to see information without the screen being too crowded.

### Bag Details - View Product
Users can view detailed information about their selected bags individually.

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

Totetally connects to a FastAPI backend to retrieve information about the bags used in the website.

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

When the user clicks **View Product**, the website sends a request to the `/bags/{id}` endpoint.

The API returns the information for the selected bag, which is then displayed as a pop-up window.

### How Does BagItUp Use the Data?

Totetall uses the retrieved data to dynamically display information such as the bag's name, brand, price, rating, collection, type, and other details.

The bag names retrieved from the API are used to populate the selection dropdowns. 

Once the user selects a bag, its information is displayed in the bag slots.

The **View Product** shows a pop-up which contains additional information about the bags individually.

The rest of the selected bag's information are displayed on the table for further comparison.

## How the Comparison Works

The user selects three bags from the selection dropdown filled with bag names.

Once the user selects the bags, the bags will show on the bag slots containing a few information, along with a view product button.

The user may open the pop-up to view more information about the product.

or, they may scroll to see the bag information in a table format.

## Project Structure
Totetally
    index.html
    style.css
    main.js
    images
        [bag_images]
    readme.md