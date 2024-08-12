const BASE_URL = "http://localhost:5000/api";



export const offerService = {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getoffersBydate
};

async function getAllOffers() {
  const response = await fetch(`${BASE_URL}/offers`);
  return await response.json();
}

async function getOfferById(id) {
  const response = await fetch(`${BASE_URL}/offers/${id}`);
  return await response.json();
}

async function createOffer(offerData) {
  const response = await fetch(`${BASE_URL}/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offerData),
  });
  return await response.json();
}

async function updateOffer(id, offerData) {
  const response = await fetch(`${BASE_URL}/offers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offerData),
  });
  return await response.json();
}

async function deleteOffer(id) {
  const response = await fetch(`${BASE_URL}/offers/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}

async function getoffersBydate(startDate,endDate){
  const response = await fetch(`${BASE_URL}/offers/byDate?startDate=${startDate}&endDate=${endDate}`, {
    method: "GET",
  });
  return await response.json();
}