import { useNavigate } from 'react-router-dom';

function OrderSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="App">
            <h1>Purchase Successful!</h1>
            <p>Your stars have been added to your account.</p>
            <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
    );
}

export default OrderSuccessPage;