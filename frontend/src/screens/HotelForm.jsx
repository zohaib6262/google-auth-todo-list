import React, { useState, useEffect } from "react";
import axios from "axios";

const HotelForm = () => {
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [notFound, setNotFound] = useState("");
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const searchHotels = async (name) => {
    if (!name.trim()) {
      setHotels([]);
      setNotFound("");
      return;
    }

    setLoading(true);
    setNotFound("");
    try {
      const res = await axios.get(
        `https://google-auth-todo-list.vercel.app/hotels/search?name=${name.trim()}`
      );

      if (res.data.length === 0) {
        setHotels([]);
        setNotFound("Hotel does not exist");
      } else {
        setHotels(res.data);
      }
    } catch (error) {
      setHotels([]);
      setNotFound("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHotels(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const newTimer = setTimeout(() => {
      searchHotels(value);
    }, 500);

    setDebounceTimer(newTimer);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Search Hotels</h2>
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center gap-3 mb-4"
      >
        <input
          type="text"
          placeholder="Enter city name"
          value={query}
          onChange={handleInputChange}
          required
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {notFound && <p className="text-red-600 text-center">{notFound}</p>}

      {hotels.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Matching Hotels:</h3>
          <ul className="space-y-3">
            {hotels.map((hotel, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded p-3 hover:shadow transition"
              >
                <a
                  href={hotel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium text-lg hover:underline"
                >
                  {hotel.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HotelForm;
// await page.type("#first_name", "Zohaib");
//   await page.type("#last_name", "Ashraf");
//   await page.type("#email", "zohaibbinashraaf@gmail.com");
//   await page.type("#phone", "03123456789");

//   const filePathResume = path.resolve(__dirname, "resume.pdf");
//   const uploadInputResume = await page.$("#resume");
//   await uploadInputResume.uploadFile(filePathResume);

//   const coverLetterPath = path.resolve(__dirname, "cover_letter.pdf");
//   const coverLetterInput = await page.$("#cover_letter");
//   await coverLetterInput.uploadFile(coverLetterPath);

//   await page.type("#question_12496666004", "Pakistan");
//   await page.type("#question_12496667004", "15000");

//   await page.click("#question_12496665004");
//   await page.keyboard.type("No");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496668004\\[\\]");
//   await page.keyboard.type("1-2 years");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496669004");
//   await page.keyboard.type("1-2 years");
//   await page.keyboard.press("Enter");
//   await page.click("#question_12496670004\\[\\]");
//   await page.keyboard.type("08:00 - 16:30");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496671004");
//   await page.keyboard.type("Yes");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496672004");
//   await page.keyboard.type("Immediately");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496673004");
//   await page.keyboard.type("a. $160");
//   await page.keyboard.press("Enter");

//   await page.click("#question_12496674004");
//   await page.keyboard.type(
//     "Yes I have, and my setup matches or exceeds requirements"
//   );
//   await page.keyboard.press("Enter");

//   await page.type("#question_12496675004", "Job Board");

//   await page.click('button[type="submit"]');
