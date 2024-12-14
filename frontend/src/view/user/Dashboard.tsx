import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/footer';
import UserHeader from '../../component/userHeader';
import Chat from '../../component/Chat';
import axios from 'axios';
import { BASE_URL } from '../../service/config';
import { Preference } from '../../model/preference';
import { userController } from '../../controller/userController';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isUserChecked, setIsUserChecked] = useState(false); 

  const [preferredActivity, setPreferredActivity] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [attractions, setAttractions] = useState('');
  const [travelWith, setTravelWith] = useState('');
  const [tripPriority, setTripPriority] = useState('');

  const navigate = useNavigate();

  const dropdownStyle = {
    width: '100%',
    minWidth: '200px',
    border: '2px solid #007BFF',
    borderRadius: '5px',
    padding: '6px',
    outline: 'none',
    fontSize: '16px',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s ease',
  };

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => reject(error),
          { timeout: 10000 }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  const fetchResults = async (query: string, lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/nearbyLocation/`, {
        mode: 'search',
        lat: lat,
        long: lng,
        inputText: query || 'cafe',
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {



    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const checkUserExists = async () => {
      if (userId) {
        try {
          const res = await userController.checkUserExists(userId);
          setIsUserChecked(res.exists)
          console.log(res); 
          if (res.exists) {
            setIsModalOpen(false);
          } else {
            setIsModalOpen(true);
          }
  
        } catch (error) {
          console.error("Error checking user:", error);
        }
      }
    };
    checkUserExists()

    
  
    getLocation()
      .then((location) => {
        setUserLocation(location);
        fetchResults('cafe', location.lat, location.lng);
      })
      .catch((error) => {
        console.error("Error getting location:", error);
        fetchResults('cafe', 1.3521, 103.8198);
      });
  }, [userId]);

  const handleQuizNext = async () => {
    if (quizStep < 5) {
      setQuizStep(quizStep + 1);
    } else {
      const user: Preference = {
        userId: userId!,
        preferredActivity,
        travelStyle,
        cuisine,
        attractions,
        travelWith,
        tripPriority,
      };

      const response = await userController.addprefernce(user);
      console.log(response);
      console.log(userId);
      console.log({
        preferredActivity,
        travelStyle,
        cuisine,
        attractions,
        travelWith,
        tripPriority,
      });

      sessionStorage.setItem('quizResults', JSON.stringify({
        preferredActivity,
        travelStyle,
        cuisine,
        attractions,
        travelWith,
        tripPriority,
      }));

      setIsModalOpen(false);
      navigate('/dashboard');
    }
  };

  const handleSearch = () => {
    if (userLocation) {
      fetchResults(searchQuery, userLocation.lat, userLocation.lng);
    }
  };

  return (
    <>
      <UserHeader />
      <main style={{ flex: '1' }}>
   
        {isModalOpen && isUserChecked && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                width: '400px',
                maxWidth: '90%',
                textAlign: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Quiz {quizStep + 1}</h2>
              <br />
             
              {quizStep === 0 && (
                <div>
                  <label htmlFor="preferredActivity">Preferred Activity:</label>
                  <select
                    id="preferredActivity"
                    name="preferredActivity"
                    style={dropdownStyle}
                    value={preferredActivity}
                    onChange={(e) => setPreferredActivity(e.target.value)}
                  >
                    <option value="">Select an activity</option>
                    <option value="Exploring historical sites">Exploring historical sites</option>
                    <option value="Visiting shopping malls">Visiting shopping malls</option>
                    <option value="Enjoying nature and parks">Enjoying nature and parks</option>
                    <option value="Trying new food experiences">Trying new food experiences</option>
                  </select>
                </div>
              )}

              {quizStep === 1 && (
                <div>
                  <label htmlFor="travelStyle">Travel Style:</label>
                  <select
                    id="travelStyle"
                    name="travelStyle"
                    style={dropdownStyle}
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                  >
                    <option value="">Select a travel style</option>
                    <option value="Relaxed and leisurely">Relaxed and leisurely</option>
                    <option value="Adventurous and active">Adventurous and active</option>
                    <option value="Luxurious and high-end">Luxurious and high-end</option>
                    <option value="Budget-conscious">Budget-conscious</option>
                  </select>
                </div>
              )}

              {quizStep === 2 && (
                <div>
                  <label htmlFor="cuisine">Cuisine Preference:</label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    style={dropdownStyle}
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  >
                    <option value="">Select a cuisine</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Malay">Malay</option>
                    <option value="Indian">Indian</option>
                    <option value="International fusion">International fusion</option>
                  </select>
                </div>
              )}

              {quizStep === 3 && (
                <div>
                  <label htmlFor="attractions">Attractions Preference:</label>
                  <select
                    id="attractions"
                    name="attractions"
                    style={dropdownStyle}
                    value={attractions}
                    onChange={(e) => setAttractions(e.target.value)}
                  >
                    <option value="">Select a type of attraction</option>
                    <option value="Cultural landmarks (temples, museums)">Cultural landmarks (temples, museums)</option>
                    <option value="Modern architecture (skyscrapers, futuristic buildings)">Modern architecture (skyscrapers, futuristic buildings)</option>
                    <option value="Nature spots (gardens, parks)">Nature spots (gardens, parks)</option>
                    <option value="Theme parks and entertainment hubs">Theme parks and entertainment hubs</option>
                  </select>
                </div>
              )}

              {quizStep === 4 && (
                <div>
                  <label htmlFor="travelWith">Are you traveling with anyone?</label>
                  <select
                    id="travelWith"
                    name="travelWith"
                    style={dropdownStyle}
                    value={travelWith}
                    onChange={(e) => setTravelWith(e.target.value)}
                  >
                    <option value="">Select travel companions</option>
                    <option value="Solo">Solo</option>
                    <option value="With family">With family</option>
                    <option value="With friends">With friends</option>
                    <option value="As a couple">As a couple</option>
                  </select>
                </div>
              )}

              {quizStep === 5 && (
                <div>
                  <label htmlFor="tripPriority">What is most important to you during your trip?</label>
                  <select
                    id="tripPriority"
                    name="tripPriority"
                    style={dropdownStyle}
                    value={tripPriority}
                    onChange={(e) => setTripPriority(e.target.value)}
                  >
                    <option value="">Select your trip priority</option>
                    <option value="Exploring local culture">Exploring local culture</option>
                    <option value="Relaxing and unwinding">Relaxing and unwinding</option>
                    <option value="Thrilling adventures">Thrilling adventures</option>
                    <option value="Creating memorable experiences">Creating memorable experiences</option>
                  </select>
                </div>
              )}

              <button
                onClick={handleQuizNext}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {/* Search bar and results */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for places (e.g., cafe, restaurant)"
            style={{
              padding: '10px',
              width: '300px',
              fontSize: '16px',
              marginRight: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Search
          </button>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
              {results.length > 0 ? (
                results.map((place) => (
                  <div
                    key={place.fsq_id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h4>{place.name}</h4>
                    <img
                      src={`${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}`}
                      alt={place.categories[0].name}
                      style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                    />
                    <p>{place.location.formatted_address}</p>
                    <p>{place.distance} meters away</p>
                  </div>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Chat />
      <Footer />
    </>
  );
};

export default Dashboard;
