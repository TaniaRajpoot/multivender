import React from 'react'
import Events from '../components/Events/Events' // Import Events, not EventCard!
import Header from '../components/Layout/Header'

const EventsPage = () => {
  return (
    <div>
      <Header activeHeading={4} />
      <Events />
    </div>
  )
}

export default EventsPage