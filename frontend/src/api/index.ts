const session = sessionStorage.getItem('session');

export async function login(bearer: string) {
    console.log(bearer)
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
  

  export async function getAllInventory() {
    const bearer = `Bearer ${session}`.replace(/['"]+/g, '')
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
  
  