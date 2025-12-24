import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const AlbumPage = () => {
  const [albums, setAlbums] = useState([])
  const [newAlbumName, setNewAlbumName] = useState('')
  const [newAlbumCover, setNewAlbumCover] = useState(null)

  const [series, setSeries] = useState([])
  const [newSeriesName, setNewSeriesName] = useState('')
  const [editingSeriesId, setEditingSeriesId] = useState(null)
  const [editedSeriesName, setEditedSeriesName] = useState('')

  const handleAddAlbum = (e) => {
    e.preventDefault()
    if (newAlbumName.trim() !== '') {
      const newAlbum = {
        id: Date.now(),
        name: newAlbumName,
        cover: newAlbumCover ? URL.createObjectURL(newAlbumCover) : 'https://via.placeholder.com/150/fbcfe8/be185d?text=Album', // Default pink placeholder
        timestamp: new Date().toLocaleString(),
      }
      setAlbums([...albums, newAlbum])
      setNewAlbumName('')
      setNewAlbumCover(null)
      alert('Album created successfully!')
    } else {
      alert('Please enter an album name.')
    }
  }

  const handleCoverUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewAlbumCover(e.target.files[0])
    }
  }

  const handleAddSeries = (e) => {
    e.preventDefault()
    if (newSeriesName.trim() !== '') {
      const newSeries = {
        id: Date.now(),
        name: newSeriesName,
        timestamp: new Date().toLocaleString(),
      }
      setSeries([...series, newSeries])
      setNewSeriesName('')
      alert('Video series created successfully!')
    } else {
      alert('Please enter a series name.')
    }
  }

  const handleRenameSeries = (id) => {
    setEditingSeriesId(id)
    const seriesToEdit = series.find(s => s.id === id)
    setEditedSeriesName(seriesToEdit ? seriesToEdit.name : '')
  }

  const handleSaveRename = (id) => {
    setSeries(series.map(s => (s.id === id ? { ...s, name: editedSeriesName, timestamp: new Date().toLocaleString() } : s)))
    setEditingSeriesId(null)
    setEditedSeriesName('')
  }

  const handleCancelRename = () => {
    setEditingSeriesId(null)
    setEditedSeriesName('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
              Welcome to Your Memory Lane!!!
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
              Create beautiful albums and curate your epic video series.
            </p>
          </div>

          {/* Albums Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200/50 mb-20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
              Your Photo Albums
            </h2>

            <form onSubmit={handleAddAlbum} className="mb-12 p-6 bg-pink-50 rounded-2xl border border-pink-100 shadow-inner flex flex-col items-center">
              <h3 className="text-xl font-semibold text-pink-700 mb-4">Create a New Album</h3>
              <input
                type="text"
                placeholder="Album Name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="w-full p-3 mb-4 rounded-lg border-2 border-pink-200 bg-white placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-pink-800"
              />
              <label className="w-full flex items-center justify-center p-3 mb-4 rounded-lg border-2 border-dashed border-pink-300 bg-pink-100 text-pink-700 cursor-pointer hover:bg-pink-200 transition-colors">
                <span className="mr-2">📸</span> {newAlbumCover ? newAlbumCover.name : 'Upload Cover Photo'}
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Add Album
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group cursor-pointer">
                  <img src={album.cover} alt={album.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-pink-800 mb-2">{album.name}</h3>
                    <p className="text-sm text-pink-500">Created: {album.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Series Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200/50 mb-20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
              Epic Cinema: Your Video Series
            </h2>

            <form onSubmit={handleAddSeries} className="mb-12 p-6 bg-pink-50 rounded-2xl border border-pink-100 shadow-inner flex flex-col items-center">
              <h3 className="text-xl font-semibold text-pink-700 mb-4">Create a New Series</h3>
              <input
                type="text"
                placeholder="Series Name"
                value={newSeriesName}
                onChange={(e) => setNewSeriesName(e.target.value)}
                className="w-full p-3 mb-4 rounded-lg border-2 border-pink-200 bg-white placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-pink-800"
              />
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Add Series
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {series.map((s) => (
                <div key={s.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group cursor-pointer">
                  <div className="relative w-full h-48 bg-pink-100 flex items-center justify-center text-pink-400 text-6xl font-bold">
                    ▶️
                  </div>
                  <div className="p-6">
                    {editingSeriesId === s.id ? (
                      <div className="flex flex-col">
                        <input
                          type="text"
                          value={editedSeriesName}
                          onChange={(e) => setEditedSeriesName(e.target.value)}
                          className="w-full p-2 mb-2 rounded-lg border border-pink-300 bg-pink-50 text-pink-800 focus:outline-none focus:border-pink-400"
                        />
                        <div className="flex space-x-2">
                          <button onClick={() => handleSaveRename(s.id)} className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full">Save</button>
                          <button onClick={handleCancelRename} className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-full">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-pink-800">{s.name}</h3>
                        <button onClick={() => handleRenameSeries(s.id)} className="text-pink-500 hover:text-pink-600 text-sm">Rename</button>
                      </div>
                    )}
                    <p className="text-sm text-pink-500">Created: {s.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Positive Note */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-pink-200/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
              Why Your Memories Matter
            </h2>
            <p className="text-xl text-pink-700 leading-relaxed font-light max-w-4xl mx-auto">
              Preserving your memories in photos and videos is a beautiful way to cherish your journey, celebrate personal milestones, and reflect on moments of joy and growth. Each album and video series becomes a testament to your experiences, providing comfort, inspiration, and a powerful connection to your past self. Embrace the art of memory-keeping, for it's through these reflections that we truly appreciate the richness of our lives. 💕
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AlbumPage
