import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import type { RootState } from '../../app/store'
import { clearMember, setMember } from '../../features/auth/authSlice'
import axiosInstance from '../../lib/axios'
import type { Member } from '../../types/member'
import './Profile.css'

const API_URL = 'http://localhost:3001'

function getMemberFromResponse(data: unknown): Member | null {
  if (typeof data !== 'object' || data === null) {
    return null
  }

  if ('memberNick' in data && '_id' in data) {
    return data as Member
  }

  if ('member' in data) {
    const responseData = data as { member?: Member }

    return responseData.member || null
  }

  return null
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data

    if (typeof data === 'object' && data !== null) {
      const responseData = data as { message?: string; error?: string }

      return responseData.message || responseData.error || 'Request failed.'
    }
  }

  return 'Something went wrong. Please try again.'
}

function getMemberImageUrl(image?: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http')) {
    return image
  }

  if (image.startsWith('/')) {
    return `${API_URL}${image}`
  }

  return `${API_URL}/${image}`
}

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authMember = useSelector((state: RootState) => state.auth.member)
  const [member, setLocalMember] = useState<Member | null>(authMember)
  const [memberNick, setMemberNick] = useState(authMember?.memberNick || '')
  const [memberPhone, setMemberPhone] = useState(authMember?.memberPhone || '')
  const [memberAddress, setMemberAddress] = useState(authMember?.memberAddress || '')
  const [memberDesc, setMemberDesc] = useState(authMember?.memberDesc || '')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMember = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await axiosInstance.get('/member/detail')
        const currentMember = getMemberFromResponse(response.data)

        if (currentMember) {
          setLocalMember(currentMember)
          setMemberNick(currentMember.memberNick)
          setMemberPhone(currentMember.memberPhone || '')
          setMemberAddress(currentMember.memberAddress || '')
          setMemberDesc(currentMember.memberDesc || '')
          dispatch(setMember(currentMember))
        } else {
          setError('Please login to view your profile.')
        }
      } catch (error) {
        console.log('Failed to load profile:', error)
        setError('Please login to view your profile.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMember()
  }, [dispatch])

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(selectedImage)
    setImagePreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [selectedImage])

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/member/logout')
    } catch (error) {
      console.log('Failed to logout:', error)
    } finally {
      dispatch(clearMember())
      navigate('/')
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      setSelectedImage(null)
      return
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setSelectedImage(null)
      setError('Please choose a JPG or PNG image.')
      event.currentTarget.value = ''
      return
    }

    setError('')
    setMessage('')
    setSelectedImage(file)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSaving) {
      return
    }

    if (!memberNick.trim() || !memberPhone.trim()) {
      setError('Nickname and phone are required.')
      return
    }

    const formData = new FormData()
    formData.append('memberNick', memberNick.trim())
    formData.append('memberPhone', memberPhone.trim())
    formData.append('memberAddress', memberAddress.trim())
    formData.append('memberDesc', memberDesc.trim())

    if (selectedImage) {
      formData.append('memberImage', selectedImage)
    }

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await axiosInstance.post('/member/update', formData)
      const updatedMember = getMemberFromResponse(response.data)

      if (updatedMember) {
        setLocalMember(updatedMember)
        dispatch(setMember(updatedMember))
        setMemberNick(updatedMember.memberNick)
        setMemberPhone(updatedMember.memberPhone || '')
        setMemberAddress(updatedMember.memberAddress || '')
        setMemberDesc(updatedMember.memberDesc || '')
      }

      setSelectedImage(null)
      setMessage('Profile updated successfully.')
    } catch (error) {
      console.log('Failed to update profile:', error)
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <section className="profile-message-card">
          <p>Loading your profile...</p>
        </section>
      </main>
    )
  }

  if (!member) {
    return (
      <main className="profile-page">
        <section className="profile-message-card">
          <h1>My Profile</h1>
          <p>{error || 'Please login to view your profile.'}</p>
          <Link to="/login">Login</Link>
        </section>
      </main>
    )
  }

  const avatarUrl = imagePreview || getMemberImageUrl(member.memberImage)

  return (
    <main className="profile-page">
      <section className="profile-layout">
        <aside className="profile-sidebar">
          <Link className="active" to="/profile">
            My Profile
          </Link>
          <Link to="/orders">My Orders</Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="profile-content">
          <h1>My Profile</h1>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-avatar-area">
              <div className="profile-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={member.memberNick} />
                ) : (
                  <span>{member.memberNick.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <label className="profile-avatar-upload">
                Camera
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <label>
              Nickname
              <input
                type="text"
                value={memberNick}
                onChange={(event) => setMemberNick(event.target.value)}
              />
            </label>

            <label>
              Phone
              <input
                type="tel"
                value={memberPhone}
                onChange={(event) => setMemberPhone(event.target.value)}
              />
            </label>

            <label>
              Address
              <input
                type="text"
                value={memberAddress}
                onChange={(event) => setMemberAddress(event.target.value)}
              />
            </label>

            <label>
              Description
              <textarea
                value={memberDesc}
                onChange={(event) => setMemberDesc(event.target.value)}
              />
            </label>

            {error && <p className="profile-message error">{error}</p>}
            {message && <p className="profile-message success">{message}</p>}

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default Profile
