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
        console.log(response);
        return true;
      } else {
        // Request failed, return false
        return null;
      }
    } catch (error) {
      // An error occurred, return false
      throw error;
    }
  }
  