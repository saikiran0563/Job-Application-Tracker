import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="footer-logo">J</div>

                    <div>
                        <h3>JobTrack</h3>
                        <p>Application Manager</p>
                    </div>
                </div>

                <div className="footer-links">
                    <a href="#dashboard">Dashboard</a>
                    <a href="#applications">Applications</a>
                    <a href="#analytics">Analytics</a>
                    <a href="#about">About</a>
                </div>

                <div className="footer-copy">
                    <p>Built to help you stay organized in your job search.</p>
                    <span>© 2026 JobTrack. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;