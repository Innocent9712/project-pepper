import { Link } from 'react-router-dom';
import { getAllInventory } from '../api';
import { useLoaderData } from 'react-router';

interface InventoryItemInterface {
    id: number;
    name: string;
    description: string;
    quantity: number;
}

interface LoaderDataInterface {
    message: string;
    inventory: InventoryItemInterface[]
}

export async function loader() {
    return getAllInventory()
}

const Inventory = () => {

const { inventory } = useLoaderData() as LoaderDataInterface;

  const handleTakeOut = (id: string | number) => {
    // Logic to handle taking out an item from inventory
    console.log('Take out item with ID:', id);
  };

  const handleRestock = (id: string | number) => {
    // Logic to handle restocking an item in inventory
    console.log('Restock item with ID:', id);
  };

  const handleDeleteInventory = (id: string | number) => {
    // Logic to handle deleting an item from inventory
    console.log('Delete item with ID:', id);
  };

  return (
    <section className="mt-8 px-4">
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-xl text-gray-700 font-bold'>Inventory</h2>
        <Link to="new">
          <button className=''>Add new item</button>
        </Link>

      </div>
      <div className="overflow-x-auto">
        <ul className="flex flex-col gap-6 min-w-[500px] min-h-[600px] bg-gray-300 text-gray-800 p-8">
          {inventory.map((item: any) => (
            <li key={item.id} className="flex-shrink-0 flex items-center gap-8">
              <span>{item.name} - Quantity: {item.quantity}</span>
              <button onClick={() => handleTakeOut(item.id)} className='text-white bg-blue-600' >Take Out</button>
              <button onClick={() => handleRestock(item.id)} className='text-white bg-green-500' >Restock</button>
              <button onClick={() => handleDeleteInventory(item.id)} className='text-white bg-red-500' >Delete Inventory</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Inventory;
