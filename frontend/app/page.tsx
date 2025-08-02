import Link from "next/link"
import {
  Hotel,
  UtensilsCrossed,
  Sparkles,
  Star,
  Users,
  Calendar,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Search,
  ClipboardList,
  Smile,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Business
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Management Suite
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your hotel, restaurant, and salon operations with our comprehensive management platform.
              Everything you need to run your business efficiently in one powerful solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:shadow-md transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Powerful Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you run a hotel, restaurant, or salon, we have the perfect management solution tailored to your
              industry needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Hotel Management */}
            <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Hotel className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hotel Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Complete hotel operations management with reservation system, room management, guest services, and
                comprehensive reporting.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Room & Reservation Management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Guest Profile & History
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Housekeeping & Maintenance
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Revenue Analytics
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/hotel"
                  className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl text-center font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Learn More
                </Link>
                <Link
                  href="/hotel/dashboard"
                  className="block w-full border-2 border-blue-500 text-blue-600 py-3 px-6 rounded-xl text-center font-medium hover:bg-blue-50 transition-all duration-200 group"
                >
                  Hotel Dashboard
                  <ArrowRight className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Restaurant Management */}
            <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UtensilsCrossed className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Streamline your restaurant operations with table management, menu control, staff scheduling, and
                customer relationship tools.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Table & Reservation System
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Menu & Inventory Management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Staff Scheduling & Payroll
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Customer Reviews & Feedback
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/restaurant"
                  className="block w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl text-center font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  Learn More
                </Link>
                <Link
                  href="/restaurant/dashboard"
                  className="block w-full border-2 border-red-500 text-red-600 py-3 px-6 rounded-xl text-center font-medium hover:bg-red-50 transition-all duration-200 group"
                >
                  Restaurant Dashboard
                  <ArrowRight className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Salon Management */}
            <div className="group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Salon Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your beauty salon with appointment scheduling, client profiles, service management, and stylist
                coordination.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Appointment Scheduling
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Client Management & History
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Service & Pricing Management
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Stylist Performance Tracking
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/salon"
                  className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-xl text-center font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
                >
                  Learn More
                </Link>
                <Link
                  href="/salon/dashboard"
                  className="block w-full border-2 border-pink-500 text-pink-600 py-3 px-6 rounded-xl text-center font-medium hover:bg-pink-50 transition-all duration-200 group"
                >
                  Salon Dashboard
                  <ArrowRight className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for hospitality businesses with features that matter most to your operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Advanced booking system with conflict detection and automated confirmations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Complete customer profiles with history, preferences, and communication tools.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime and automatic backups.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support to keep your business running smoothly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of successful businesses that have transformed their operations with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Bookings Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from real businesses using our platform every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "This platform completely transformed how we manage our hotel. Bookings are up 40% and our staff is more
                efficient than ever."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-gray-900">John Davis</div>
                  <div className="text-gray-600">Grand Plaza Hotel</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The restaurant management features are incredible. We've reduced no-shows by 60% and our table turnover
                has improved significantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  MR
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Rodriguez</div>
                  <div className="text-gray-600">Bella Vista Restaurant</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Our salon has never been more organized. Client management and appointment scheduling are seamless.
                Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  SL
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Lee</div>
                  <div className="text-gray-600">Luxe Beauty Salon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business size and needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for small businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Up to 100 bookings/month
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Basic reporting
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Email support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Mobile app access
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Start Free Trial
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $79<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For growing businesses</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Up to 500 bookings/month
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Custom integrations
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $199<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Unlimited bookings
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  White-label solution
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  24/7 phone support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Dedicated account manager
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Custom development
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plan and book your next experience in just a few steps.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Service</h3>
              <p className="text-gray-600">
                Select the hotel, restaurant or salon service that suits your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Provide Details</h3>
              <p className="text-gray-600">
                Enter your preferred dates, party size and contact information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Your Booking</h3>
              <p className="text-gray-600">
                Review and submit your request — we’ll handle the rest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy Your Visit</h3>
              <p className="text-gray-600">
                Relax and look forward to a seamless experience at our venues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We’re here to help.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-lg cursor-pointer">How do I make a booking?</summary>
              <p className="mt-2 text-gray-600">
                Simply select the type of service you’d like and follow the prompts to choose your dates and provide your details.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-lg cursor-pointer">Do I need an account to book?</summary>
              <p className="mt-2 text-gray-600">
                No. You can make reservations and appointments without creating an account. We only need your contact information.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-lg cursor-pointer">Can I modify or cancel my booking?</summary>
              <p className="mt-2 text-gray-600">
                Yes. Please contact us directly via phone or email with your reservation details and we’ll assist you.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-lg cursor-pointer">What payment methods are accepted?</summary>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards. Payment information will be requested once your booking is confirmed.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact & Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions, suggestions or feedback? Send us a message and our team will respond promptly.
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter to receive the latest news, updates and special offers.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses and start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">BusinessSuite</h3>
              <p className="text-gray-400 mb-4">
                The complete management solution for hotels, restaurants, and salons.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/hotel/dashboard" className="hover:text-white transition-colors">
                    Hotel Management
                  </Link>
                </li>
                <li>
                  <Link href="/restaurant/dashboard" className="hover:text-white transition-colors">
                    Restaurant Management
                  </Link>
                </li>
                <li>
                  <Link href="/salon/dashboard" className="hover:text-white transition-colors">
                    Salon Management
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Enterprise Solutions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@businesssuite.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Business Ave, Suite 100
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BusinessSuite. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
