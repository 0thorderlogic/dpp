function Footer() {
  return (
    <footer className="footer">
      <div>
        DPP v1.0.0 // 
        <a
          href="https://github.com/0thorderlogic/dpp"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '5px' }}
        >
          SOURCE
        </a>
        <span style={{ margin: '0 10px' }}>|</span>
        SUPPORT: <a href="mailto:aoneone5@protonmail.com" style={{ marginLeft: '5px' }}>ISI TIH</a>
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.8em', opacity: 0.5 }}>
        Technological Innovation Hub @ Indian Statistical Institute
      </div>
    </footer>
  );
}

export default Footer;
