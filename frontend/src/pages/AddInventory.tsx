import { Form, redirect } from 'react-router-dom'
import { addInventoryItem } from '../api';
import { InventoryItem } from '../typings';
import { PopOverOne, PopOverTwo } from '../components/PopOver';

export async function action({ request }: { request: Request }): Promise<string | Response> {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const quantity = parseInt(formData.get("quantity") as string);

    const data: InventoryItem = {
        name,
        description,
        quantity
    }
    
    try {
      const response = await addInventoryItem(data);
      console.log(response)
      if (response) return redirect("/inventory");
      throw new Error("Add new item Failed")
    } catch (err: any) {
      alert(err)
      return err.message;
    }
}

const AddInventory = () => {
  return (
    <section className="mt-8 px-4">
        <h2 className='text-xl text-gray-700 font-bold'>Add Inventory</h2>
        <Form method='post'>
            <div className='w-[90%] max-w-xl mt-8 mx-auto lg:mx-0 lg:ml-12'>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Item name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100 text-black"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Item description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100 text-black"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Item quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="w-full border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-100 text-black"
                        required
                    />
                </div>
            </div>
            <div className='flex justify-center'>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    done
                </button>
            </div>
            <PopOverOne />
            <PopOverTwo />
        </Form>
    </section>
  )
}

export default AddInventory