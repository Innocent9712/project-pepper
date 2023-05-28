import React from 'react';
import { Form, useNavigation } from 'react-router-dom';
import { login } from '../api';
import { redirect } from 'react-router-dom';



export async function action({ request }: { request: Request }): Promise<string | Response> {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const credentials = btoa(`${username}:${password}`);
  
  try {
    const user_session = await login(credentials);
    sessionStorage.setItem("session", JSON.stringify(user_session))
    console.log(user_session)
    if (user_session) return redirect("/dashboard?login=success");
    throw new Error("Login Failed")
  } catch (err: any) {
    return err.message;
  }
}


const Login: React.FC = () => {
  const navigation = useNavigation()


  return (
    <div className="max-w-md mx-auto pt-16 w-[90%]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <Form method='post' replace>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100 text-black"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            disabled={navigation.state == "submitting"}
          >
            {navigation.state === "submitting" ? "Loggin in..." : "Login"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
