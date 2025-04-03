export const updatePWATheme = (theme: 'light' | 'dark') => {
  const themeColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  
  // Update theme-color meta tag
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', themeColor);
  }

  // Update manifest theme color
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    const manifestUrl = manifestLink.getAttribute('href');
    if (manifestUrl) {
      fetch(manifestUrl)
        .then(response => response.json())
        .then(manifest => {
          manifest.theme_color = themeColor;
          manifest.background_color = backgroundColor;
          
          // Create a new manifest blob
          const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
          const newManifestUrl = URL.createObjectURL(blob);
          
          // Update the manifest link
          manifestLink.setAttribute('href', newManifestUrl);
        });
    }
  }
}; 