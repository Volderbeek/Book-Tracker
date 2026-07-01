import { render, screen } from '@testing-library/react';
import { Footer } from '../../components/Footer';

describe('Footer Component', () => {
  it('should render the footer with copyright and location info', () => {
    render(<Footer />);
    
    // Check that the footer text is present
    const footerText = screen.getByText(/Ohara Library © 2026/i);
    expect(footerText).toBeInTheDocument();
    expect(screen.getByText(/Made with GUSTO in Massachusetts/i)).toBeInTheDocument();
  });
});
