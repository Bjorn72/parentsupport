// This file handles section switching and responsive menu behavior.

const sectionElements = Array.from(document.querySelectorAll('[data-section]'));
const navSectionItems = Array.from(document.querySelectorAll('.nav-item[data-section]'));
const mobileMenu = document.getElementById('mobileMenu');
const menuToggleButton = document.getElementById('menuToggle');
const pinButtons = Array.from(document.querySelectorAll('[data-pin-section]'));
const pinnedTopicsBlock = document.getElementById('pinnedTopicsBlock');
const pinnedTopicsList = document.getElementById('pinnedTopicsList');
const deviceButtons = Array.from(document.querySelectorAll('[data-device-toggle]'));
const deviceContentBlocks = Array.from(document.querySelectorAll('[data-device-content]'));
const deviceTopicElements = Array.from(document.querySelectorAll('[data-device-topic]'));

const PINNED_STORAGE_KEY = 'supportPinnedSections';
const DEVICE_STORAGE_KEY = 'supportSelectedDevice';
const DEFAULT_DEVICE = 'iphone';
const PINNED_SECTION_ID_MAP = {
  'voice-text': 'notes',
  'search-phone': 'search',
  'add-contact': 'contacts',
};

let selectedDevice = DEFAULT_DEVICE;

function isValidSectionId(sectionId) {
  return sectionElements.some((sectionElement) => sectionElement.id === sectionId);
}

function loadPinnedSections() {
  try {
    const rawValue = localStorage.getItem(PINNED_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((sectionId) => PINNED_SECTION_ID_MAP[sectionId] || sectionId)
      .filter((sectionId) => typeof sectionId === 'string' && isValidSectionId(sectionId))
      .filter((sectionId, index, list) => list.indexOf(sectionId) === index);
  } catch (error) {
    return [];
  }
}

function savePinnedSections(sectionIds) {
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(sectionIds));
  } catch (error) {
    // Ignore storage failures and keep the UI usable.
  }
}

function getSectionTitle(sectionId) {
  const sectionElement = sectionElements.find((element) => element.id === sectionId);
  if (!sectionElement) {
    return sectionId;
  }

  const heading = sectionElement.querySelector('h2');
  return heading ? heading.textContent.trim() : sectionId;
}

function loadSelectedDevice() {
  try {
    const storedDevice = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (storedDevice === 'iphone' || storedDevice === 'mac') {
      return storedDevice;
    }
  } catch (error) {
    // Ignore storage failures and use default value.
  }

  return DEFAULT_DEVICE;
}

function saveSelectedDevice(device) {
  try {
    localStorage.setItem(DEVICE_STORAGE_KEY, device);
  } catch (error) {
    // Ignore storage failures and keep UI usable.
  }
}

function applySelectedDevice(device) {
  selectedDevice = device;

  deviceButtons.forEach((buttonElement) => {
    const isActive = buttonElement.dataset.deviceToggle === device;
    buttonElement.classList.toggle('active', isActive);
    buttonElement.setAttribute('aria-pressed', String(isActive));
  });

  deviceContentBlocks.forEach((contentBlock) => {
    contentBlock.hidden = contentBlock.dataset.deviceContent !== device;
  });

  deviceTopicElements.forEach((topicElement) => {
    topicElement.hidden = topicElement.dataset.deviceTopic !== device;
  });

  const activeSection = sectionElements.find((sectionElement) => sectionElement.classList.contains('active'));
  if (activeSection && activeSection.hidden) {
    showSection('start');
  }
}

function showSection(sectionId) {
  const sectionToShow = sectionElements.find((sectionElement) => sectionElement.id === sectionId);
  const safeSectionId = !sectionToShow || sectionToShow.hidden ? 'start' : sectionId;

  sectionElements.forEach((sectionElement) => {
    sectionElement.classList.toggle('active', sectionElement.id === safeSectionId);
  });

  navSectionItems.forEach((navItem) => {
    navItem.classList.toggle('active', navItem.dataset.section === safeSectionId);
  });
}

function closeMobileMenu() {
  if (!mobileMenu || !menuToggleButton) {
    return;
  }

  mobileMenu.classList.remove('open');
  menuToggleButton.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
  if (!mobileMenu || !menuToggleButton) {
    return;
  }

  const isOpen = mobileMenu.classList.toggle('open');
  menuToggleButton.setAttribute('aria-expanded', String(isOpen));
}

function renderPinButtons() {
  const pinnedSections = new Set(loadPinnedSections());

  pinButtons.forEach((buttonElement) => {
    const sectionId = buttonElement.dataset.pinSection;
    const isPinned = pinnedSections.has(sectionId);

    buttonElement.classList.toggle('pinned', isPinned);
    buttonElement.setAttribute('aria-pressed', String(isPinned));
    buttonElement.textContent = isPinned ? 'Ta bort fäst ämne' : 'Fäst ämne';
  });
}

function renderPinnedTopics() {
  if (!pinnedTopicsBlock || !pinnedTopicsList) {
    return;
  }

  pinnedTopicsList.innerHTML = '';
  const pinnedSections = loadPinnedSections();

  const visiblePinnedSections = pinnedSections.filter((sectionId) => {
    const sectionElement = sectionElements.find((element) => element.id === sectionId);
    if (!sectionElement) {
      return false;
    }

    const deviceTopic = sectionElement.dataset.deviceTopic;
    return !deviceTopic || deviceTopic === selectedDevice;
  });

  if (visiblePinnedSections.length === 0) {
    pinnedTopicsBlock.hidden = true;
    return;
  }

  pinnedTopicsBlock.hidden = false;

  visiblePinnedSections.forEach((sectionId) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'pinned-topic-row';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'topic-button';
    openButton.dataset.sectionTarget = sectionId;
    openButton.textContent = getSectionTitle(sectionId);

    const unpinButton = document.createElement('button');
    unpinButton.type = 'button';
    unpinButton.className = 'unpin-button';
    unpinButton.dataset.unpinSection = sectionId;
    unpinButton.textContent = 'Ta bort fäst';

    rowElement.append(openButton, unpinButton);
    pinnedTopicsList.append(rowElement);
  });
}

function togglePinnedSection(sectionId) {
  const pinnedSections = loadPinnedSections();
  const existingIndex = pinnedSections.indexOf(sectionId);

  if (existingIndex >= 0) {
    pinnedSections.splice(existingIndex, 1);
  } else {
    pinnedSections.push(sectionId);
  }

  savePinnedSections(pinnedSections);
  renderPinButtons();
  renderPinnedTopics();
}

function unpinSection(sectionId) {
  const pinnedSections = loadPinnedSections().filter((id) => id !== sectionId);
  savePinnedSections(pinnedSections);
  renderPinButtons();
  renderPinnedTopics();
}

navSectionItems.forEach((navItem) => {
  navItem.addEventListener('click', (event) => {
    event.preventDefault();
    showSection(navItem.dataset.section);
    closeMobileMenu();
  });
});

if (menuToggleButton) {
  menuToggleButton.addEventListener('click', toggleMobileMenu);
}

document.addEventListener('click', (event) => {
  const targetElement = event.target.closest(
    '[data-section-target], [data-pin-section], [data-unpin-section], [data-device-toggle]'
  );
  if (!targetElement) {
    return;
  }

  if (targetElement.dataset.deviceToggle) {
    applySelectedDevice(targetElement.dataset.deviceToggle);
    saveSelectedDevice(targetElement.dataset.deviceToggle);
    return;
  }

  if (targetElement.dataset.sectionTarget) {
    showSection(targetElement.dataset.sectionTarget);
    closeMobileMenu();
    return;
  }

  if (targetElement.dataset.pinSection) {
    togglePinnedSection(targetElement.dataset.pinSection);
    return;
  }

  if (targetElement.dataset.unpinSection) {
    unpinSection(targetElement.dataset.unpinSection);
  }
});

applySelectedDevice(loadSelectedDevice());
renderPinButtons();
renderPinnedTopics();
showSection('start');
