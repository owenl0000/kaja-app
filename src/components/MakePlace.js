import React, { useState } from 'react';

const MakePlace = ({ onAddPlace, selectedDate }) => {
  const [showForm, setShowForm] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    contact: '',
    description: '',
    image: '',
    stars: '',
    reviews: '',
    price: '',
    yelpLink: ''
  });

  const handleChange = (e) => {
    setNewPlace({ ...newPlace, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Create a URL pointing to the selected file
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setNewPlace({ ...newPlace, image: imageUrl });
    }
  };

  const handlePriceChange = (e) => {
    setNewPlace({ ...newPlace, price: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlace({ ...newPlace, id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }, selectedDate);
    setShowForm(false); // Hide form after submission
    setNewPlace({
      name: '',
      address: '',
      contact: '',
      description: '',
      image: '',
      stars: '',
      reviews: '',
      price: '',
      yelpLink: ''
    });
  };

  return (
    <div className={"w-full"}>
      <button 
        className="bg-coral text-white text-center p-5 my-5 w-full rounded-md overflow-hidden"
        onClick={() => setShowForm(true)}
      >
        Add Your Own Place
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <button 
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              {/* Form fields here */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  id="name" 
                  type="text" 
                  name="name" 
                  value={newPlace.name} 
                  onChange={handleChange} 
                  placeholder="Name"
                />
                
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  name="address"
                  value={newPlace.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contact"
                >
                  Contact
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contact"
                  type="text"
                  name="contact"
                  value={newPlace.contact}
                  onChange={handleChange}
                  placeholder="Contact"
                />
              </div>
              {/* Price Range input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Price Range
                </label>
                <select
                  id="price"
                  name="price"
                  value={newPlace.price}
                  onChange={handlePriceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Price Range</option>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                  <option value="$$$$">$$$$</option>
                  <option value="$$$$$">$$$$$</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="yelpLink"
                >
                  Link
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="yelpLink"
                  type="text"
                  name="yelpLink"
                  value={newPlace.yelpLink}
                  onChange={handleChange}
                  placeholder="Link"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="image"
                >
                  Image
                </label>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                />
                <label
                  className="bg-coral hover:bg-red-300 text-white py-2 px-4 rounded cursor-pointer block text-center"
                  htmlFor="image"
                >
                  Upload Image
                </label>

                {newPlace.image && (
                  <div className="mt-2 flex justify-center">
                    <img src={newPlace.image} alt="Uploaded" className="max-w-xs h-auto rounded" />
                  </div>
                )}
              </div>
              {/* Add other fields similarly */}
              <button 
                type="submit" 
                className="bg-coral hover:bg-red-300 text-white font-bold py-2 px-4 rounded"
              >
                Add Place
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakePlace;
