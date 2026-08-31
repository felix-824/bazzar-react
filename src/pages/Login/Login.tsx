import type { FormEvent } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { setMember } from '../../features/auth/authSlice'
import axiosInstance from '../../lib/axios'
import type { Member } from '../../types/member'
import './Login.css'

type AuthTab = 'login' | 'signup'

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

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [memberNick, setMemberNick] = useState('')
  const [memberPhone, setMemberPhone] = useState('')
  const [memberPassword, setMemberPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const resetForm = () => {
    setFormError('')
    setMemberNick('')
    setMemberPhone('')
    setMemberPassword('')
    setConfirmPassword('')
    setShowPassword(false)
  }

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab)
    resetForm()
  }

  const handleLogin = async () => {
    if (!memberNick.trim() || !memberPassword) {
      setFormError('Please enter your nickname and password.')
      return
    }

    const response = await axiosInstance.post('/member/login', {
      memberNick: memberNick.trim(),
      memberPassword,
    })
    const member = getMemberFromResponse(response.data)

    if (member) {
      dispatch(setMember(member))
    }

    navigate('/')
  }

  const handleSignup = async () => {
    if (
      !memberNick.trim() ||
      !memberPhone.trim() ||
      !memberPassword ||
      !confirmPassword
    ) {
      setFormError('Please fill in all signup fields.')
      return
    }

    if (memberPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    const response = await axiosInstance.post('/member/signup', {
      memberNick: memberNick.trim(),
      memberPhone: memberPhone.trim(),
      memberPassword,
    })
    const member = getMemberFromResponse(response.data)

    if (member) {
      dispatch(setMember(member))
      navigate('/')
      return
    }

    setActiveTab('login')
    setFormError('Signup successful. Please login with your new account.')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    setIsLoading(true)
    setFormError('')

    try {
      if (activeTab === 'login') {
        await handleLogin()
      } else {
        await handleSignup()
      }
    } catch (error) {
      console.log('Authentication failed:', error)
      setFormError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-tabs">
          <button
            type="button"
            className={activeTab === 'login' ? 'login-tab active' : 'login-tab'}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={activeTab === 'signup' ? 'login-tab active' : 'login-tab'}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Nickname
            <input
              type="text"
              placeholder="Enter your nickname"
              value={memberNick}
              onChange={(event) => setMemberNick(event.target.value)}
            />
          </label>

          {activeTab === 'signup' && (
            <label>
              Phone
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={memberPhone}
                onChange={(event) => setMemberPhone(event.target.value)}
              />
            </label>
          )}

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={memberPassword}
                onChange={(event) => setMemberPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {activeTab === 'signup' && (
            <label>
              Confirm Password
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          )}

          {formError && <p className="login-message">{formError}</p>}

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading
              ? activeTab === 'login'
                ? 'Logging in...'
                : 'Creating account...'
              : activeTab === 'login'
                ? 'Login'
                : 'Sign Up'}
          </button>

          <p className="login-signup">
            {activeTab === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              type="button"
              onClick={() =>
                handleTabChange(activeTab === 'login' ? 'signup' : 'login')
              }
            >
              {activeTab === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
