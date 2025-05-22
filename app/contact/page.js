'use client'
import React, { useState } from 'react'
import Navbar from '@/ui/Navbar'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  // Predefined greetings text (two lines)
  const greetingsText = `Hello!\nHope you're having a great day!\nI wanna happy to be connected with you or will be happy to be a contributer`

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // On clicking the Greetings button, set the message field with greetings text
  const handleGreetingClick = () => {
    setFormData(prev => ({ ...prev, message: greetingsText }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      setStatus(data.message)

      if (data.success) {
        setFormData({ name: '', email: '', message: '' })
      }
    } catch (err) {
      setStatus('Something went wrong.')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-lg mb-10 text-center text-gray-300">
            Have questions, feedback, or want to collaborate? Drop us a message below.
          </p>
          <form
            className="space-y-6 bg-white p-8 rounded-2xl shadow-xl text-black"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Your message..."
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none whitespace-pre-wrap"
              ></textarea>
            </div>
            <div className="text-center flex justify-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={handleGreetingClick}
                className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition-all duration-300"
              >
                Greetings
              </button>
            </div>
            {status && <p className="mt-4 text-sm text-green-600 text-center">{status}</p>}
          </form>
        </div>
      </div>
    </>
  )
}

export default Contact
