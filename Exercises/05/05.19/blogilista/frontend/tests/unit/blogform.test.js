/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import BlogForm from '../../src/components/BlogForm'

describe('<BlogForm />', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogForm createBlog={createBlog} />)

    let input = screen.getByPlaceholderText('Blog title')

    await user.type(input, 'Test blog title')

    input = screen.getByPlaceholderText('Blog author')

    await user.type(input, 'Test blog author')

    input = screen.getByPlaceholderText('Blog url')

    await user.type(input, 'Test blog url')

    const sendButton = screen.getByText('Publish')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test blog title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test blog author')
    expect(createBlog.mock.calls[0][0].url).toBe('Test blog url')
  })
})
