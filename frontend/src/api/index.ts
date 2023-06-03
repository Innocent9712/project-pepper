import { InventoryItem } from "../typings";

const session = sessionStorage.getItem('session');
const bearer = `Bearer ${session}`.replace(/['"]+/g, '')


export async function login(bearer: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
      },
      // Add body data if needed
      // body: JSON.stringify(data),
    });
    alert(`resp:" ${response}`)

    if (response.ok) {
      // Request successful, return true
      const data = await response.json()
      console.log(data);
      return data.session_token;
    } else {
      // Request failed, return false
      return null;
    }
  } catch (error) {
    // An error occurred, return false
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.ok) {
      // Request successful, return true
      return true;
    } else {
      // Request failed, return false
      return false;
    }
  } catch (error) {
    // An error occurred, return false
    throw error;
  }
}


export async function getAllInventory() {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/inventory`, {
      headers: {
        Authorization: bearer,
      },
    });

    if (response.ok) {
      // Request successful, return the JSON data
      const data = await response.json();
      // console.log(data);
      return data;
    } else {
      // Request failed, return null
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function addInventoryItem(item: InventoryItem) {
  try {
    console.log(item)
    const response = await fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/inventory/create`, {
      method: 'POST',
      body: JSON.stringify({
        "name": item.name,
        "description": item.description,
        "quantity": item.quantity
      }),
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
    });
      console.log(response);
    if (response.ok) {
      // Request successful, return the JSON data
      const data = await response.json();
      // console.log(data);
      return data;
    } else {
      // Request failed, return null
      return null;
    }
  } catch (error) {
    throw error;
  }
}
  
  