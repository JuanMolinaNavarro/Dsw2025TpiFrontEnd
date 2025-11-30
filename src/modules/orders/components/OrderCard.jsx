import Button from '../../shared/components/Button';

function OrderCard({ order }) {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex-1'>
        <h2 className='text-lg font-semibold'>#{order.number} - {order.clientName}</h2>
        <p className='text-sm text-gray-600'>Estado: {order.status}</p>
      </div>
      <Button className='bg-purple-200 text-purple-700 font-medium px-4 py-2 rounded-lg'>
        Ver
      </Button>
    </div>
  );
}

export default OrderCard;
