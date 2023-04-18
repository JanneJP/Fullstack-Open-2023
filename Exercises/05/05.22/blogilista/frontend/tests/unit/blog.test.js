/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import Blog from '../../src/components/Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Test blog title',
    author: 'Test blog author',
    url: 'Test blog url',
    user: {
      username: 'Test User',
      name: 'Test User'
    }
  }

  const user = {
    username: 'Test User',
    name: 'Test User'
  }

  const mockLikeHandler = jest.fn()
  const mockRemoveHandler = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={user}
        buttonLabel='Show'
        likeBlog={mockLikeHandler}
        removeBlog={mockRemoveHandler}/>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('Test blog title')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('Like button works', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Like')

    await user.click(button)
    await user.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
