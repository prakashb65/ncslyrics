import Image from 'next/image';

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Support Our Ministry</h1>
      
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          Your donations help us maintain and grow our collection of Nepali Christian songs.
          Every contribution makes a difference!
        </p>
      </div>

      <div className="grid gap-6">
        {/* PayPal Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-semibold mb-4">Donate with PayPal</h2>
            <Image
              src="/images/paypal-logo.jpg"
              alt="PayPal"
              width={111}
              height={69}
              className="mb-4"
            />
          </div>
          <p className="text-gray-600 mb-4 text-center">
            Make a secure donation through PayPal
          </p>
          <div className="flex justify-center">
            <form action="https://www.paypal.com/donate" method="post" target="_blank">
              <input type="hidden" name="business" value="YOUR_PAYPAL_EMAIL" />
              <input type="hidden" name="currency_code" value="USD" />
              <button
                type="submit"
                className="bg-[#0070BA] text-white px-6 py-2 rounded-md hover:bg-[#003087] transition-colors"
              >
                Donate with PayPal
              </button>
            </form>
          </div>
        </div>

        {/* Zelle Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Donate with Zelle</h2>
            <Image
              src="/images/zelle-logo.png"
              alt="Zelle"
              width={80}
              height={30}
              className="object-contain"
            />
          </div>
          <p className="text-gray-600 mb-4">
            Send your donation directly using Zelle
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">biswap65@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">Prakash Biswa</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Open your banking app and send your donation using the details above
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-2">Other Ways to Support</h3>
          <p className="text-gray-600">
            If you prefer other methods of donation or have any questions, please contact us at{' '}
            <a href="mailto:ncslyrics55@gmail.com" className="text-blue-500 hover:underline">
              ncslyrics55@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 