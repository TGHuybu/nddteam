// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.anim').forEach(el => observer.observe(el));

// Publications list interaction
document.addEventListener('DOMContentLoaded', () => {
  const pubItems = document.querySelectorAll('.pub-item[data-pub-id]');
  const summaryPanel = document.querySelector('.pub-summary-panel');
  const summaryPlaceholder = document.querySelector('.pub-summary-placeholder');
  const summaryContent = document.querySelector('.pub-summary-content');

  if (!pubItems.length || !summaryPanel) return;

  pubItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      pubItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Show summary content, hide placeholder
      if (summaryPlaceholder) summaryPlaceholder.style.display = 'none';
      if (summaryContent) summaryContent.style.display = 'block';
      
      // Extract data from the clicked publication (you'll populate this later)
      const pubId = item.getAttribute('data-pub-id');
      
      // Update summary panel with publication data
      updateSummaryPanel(item, pubId);
    });
  });

  // Check if on mobile (< 768px)
  function isMobile() {
    return window.innerWidth < 768;
  }

  // Handle mobile modal (you can add this when ready)
  if (isMobile()) {
    pubItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // For now, the click handler above works for both desktop and mobile
        // You can add modal trigger here later
      });
    });
  }
});

// Function to update summary panel from publications data
function updateSummaryPanel(pubElement, pubId) {
  const summaryContent = document.querySelector('.pub-summary-content');
  const summaryPlaceholder = document.querySelector('.pub-summary-placeholder');
  if (!summaryContent) return;

  const data = publicationsData[pubId];
  
  // Update header section from the publication element (always available)
  const summaryTitle = summaryContent.querySelector('.summary-title');
  const summaryAuthors = summaryContent.querySelector('.summary-authors');
  const summaryJournal = summaryContent.querySelector('.summary-journal');

  const authors = pubElement.querySelector('.pub-authors')?.textContent || '';
  const title = pubElement.querySelector('.pub-title')?.textContent || '';
  const journalElement = pubElement.querySelector('.pub-journal a');
  const journalText = journalElement?.textContent || '';
  const journalLink = journalElement?.href || '';

  if (summaryTitle) summaryTitle.textContent = title;
  if (summaryAuthors) summaryAuthors.textContent = authors;
  if (summaryJournal) {
    if (journalLink) {
      summaryJournal.innerHTML = `<a href="${journalLink}" target="_blank">${journalText}</a>`;
    } else {
      summaryJournal.textContent = journalText;
    }
  }

  // Hide placeholder
  if (summaryPlaceholder) summaryPlaceholder.style.display = 'none';

  // If no data found, show "no summary available" message
  if (!data) {
    const summaryBody = summaryContent.querySelector('.summary-body');
    if (summaryBody) {
      const oldSequence = summaryBody.querySelector('.content-sequence');
      if (oldSequence) {
        oldSequence.remove();
      }
      
      const noDataDiv = document.createElement('div');
      noDataDiv.className = 'content-sequence';
      noDataDiv.innerHTML = '<p class="content-text" style="color: var(--text-muted); font-style: italic;">No summary available for this paper at the moment, please check back later</p>';
      
      const linksSection = summaryBody.querySelector('.summary-links');
      if (linksSection) {
        linksSection.parentNode.insertBefore(noDataDiv, linksSection);
      } else {
        summaryBody.appendChild(noDataDiv);
      }
    }
    return;
  }

  // Render sequential content (text and images in order)
  const summaryBody = summaryContent.querySelector('.summary-body');
  if (summaryBody && data.content) {
    // Create new content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-sequence';

    // Render each content item sequentially
    data.content.forEach(item => {
      if (item.type === 'text') {
        const textEl = document.createElement('p');
        textEl.className = 'content-text';
        textEl.textContent = item.value;
        contentContainer.appendChild(textEl);
      } else if (item.type === 'image') {
        const figDiv = document.createElement('div');
        figDiv.className = 'content-figure';
        figDiv.innerHTML = `
          <img src="${item.src}" alt="Figure" class="figure-image" />
          ${item.caption ? `<p class="figure-caption">${item.caption}</p>` : ''}
        `;
        contentContainer.appendChild(figDiv);
      }
    });

    // Replace old content with new
    const oldSequence = summaryBody.querySelector('.content-sequence');
    if (oldSequence) {
      oldSequence.replaceWith(contentContainer);
    } else {
      // Find where to insert (after journal, before links)
      const linksSection = summaryBody.querySelector('.summary-links');
      if (linksSection) {
        linksSection.parentNode.insertBefore(contentContainer, linksSection);
      } else {
        summaryBody.appendChild(contentContainer);
      }
    }
  }

  // Update additional links
  const summaryLinks = summaryContent.querySelector('.summary-links');
  if (summaryLinks && data.additionalLinks && data.additionalLinks.length > 0) {
    summaryLinks.innerHTML = '';
    data.additionalLinks.forEach(link => {
      const linkEl = document.createElement('a');
      linkEl.href = link.url;
      linkEl.target = '_blank';
      linkEl.className = 'summary-link';
      linkEl.textContent = link.text;
      summaryLinks.appendChild(linkEl);
    });
  }
}
