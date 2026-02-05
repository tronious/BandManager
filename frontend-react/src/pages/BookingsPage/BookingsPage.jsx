import { PageHeader } from '@/components/shared/PageHeader.jsx'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitBooking, clearBookingStatus } from '@/store/slices/bookingsSlice.js'
import { hideLoading, showLoading } from '@/store/slices/uiSlice.js'
import './BookingsPage.css'

export function BookingsPage() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.bookings?.status)
  const submitError = useSelector((state) => state.bookings?.error)
  const submitSuccess = useSelector((state) => state.bookings?.success)

  const isSubmitting = status === 'pending'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    venue: '',
    message: '',
  })

  useEffect(() => {
    dispatch(clearBookingStatus())
  }, [dispatch])

  async function onSubmit(e) {
    e.preventDefault()
    dispatch(showLoading({ message: 'Sending your inquiry...' }))
    const result = await dispatch(submitBooking(form))
    dispatch(hideLoading())

    if (submitBooking.fulfilled.match(result)) {
      setForm({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        venue: '',
        message: '',
      })
    }
  }

  return (
    <div className="page">
      <PageHeader title="Book Us!" />

      <div className="booking-content">
        <div className="booking-intro">
          <p>
            Looking for live music for your wedding, corporate event, private party, or venue? We'd love to
            hear from you!
          </p>
        </div>

        <div className="booking-form-container">
          <form className="booking-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  type="text"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  type="tel"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventDate">Event Date *</label>
                <input
                  id="eventDate"
                  value={form.eventDate}
                  onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventType">Type of Event *</label>
              <select
                id="eventType"
                value={form.eventType}
                onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                required
              >
                <option value="">Select an event type...</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="private">Private Party</option>
                <option value="venue">Venue / Bar / Restaurant</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue / Location</label>
              <input
                id="venue"
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                type="text"
                placeholder="Venue name and city"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Tell us about your event *</label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                placeholder="What's the occasion? How long do you need us? Any special requests?"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>

            {submitError ? <p className="error-message">{submitError}</p> : null}
            {submitSuccess ? (
              <p className="success-message">Thanks for reaching out! We'll get back to you soon.</p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}
