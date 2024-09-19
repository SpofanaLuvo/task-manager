const UserDetails = () => {
    // Mock user data
    const user = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, USA",
    };
  
    return (
      <section className="bg-white p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-600">Name:</span>
            <p className="text-gray-800">{user.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone:</span>
            <p className="text-gray-800">{user.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Address:</span>
            <p className="text-gray-800">{user.address}</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default UserDetails;
  