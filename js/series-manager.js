// FLEX Project Page - Series Manager

class SeriesManager {
    constructor() {
        this.works = [];
        this.currentFilter = 'all';
        this.container = document.getElementById('series-grid');
        this.init();
    }

    async init() {
        await this.loadWorks();
        this.render();
        this.initFilters();
    }

    async loadWorks() {
        try {
            const response = await fetch('data/series-works.json');
            const data = await response.json();
            this.works = data.series_works || [];
        } catch (error) {
            console.error('Failed to load series works:', error);
            this.works = this.getFallbackWorks();
        }
    }

    getFallbackWorks() {
        // Fallback data if JSON fails to load
        return [
            {
                id: 'flex-core-2024',
                title: 'FLEX: Forward Learning from Experience',
                status: 'published',
                domain: 'methodology',
                icon: '🌟',
                description: 'The foundational work introducing the FLEX paradigm for inheritable intelligence through experience accumulation.',
                date: '2024',
                metrics: {
                    key_improvement: 'AIME: 40% → 63.3%'
                },
                links: {
                    paper: '#',
                    code: 'https://github.com/GenSI-THUAIR/FLEX'
                },
                is_core: true
            }
        ];
    }

    render() {
        if (!this.container) return;

        const filteredWorks = this.filterWorks();

        if (filteredWorks.length === 0) {
            this.container.innerHTML = this.renderEmptyState();
            return;
        }

        this.container.innerHTML = filteredWorks
            .map(work => this.renderCard(work))
            .join('');

        // Add stagger animation
        this.container.querySelectorAll('.series-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('stagger-item');
        });
    }

    filterWorks() {
        if (this.currentFilter === 'all') {
            return this.works;
        }
        return this.works.filter(work => work.domain === this.currentFilter);
    }

    renderCard(work) {
        const statusClass = `status-${work.status.replace('_', '-')}`;
        const statusLabel = this.getStatusLabel(work.status);
        const coreClass = work.is_core ? 'core-work' : '';
        
        return `
            <div class="series-card ${coreClass}" data-domain="${work.domain}">
                <div class="series-card-header">
                    <div class="card-header-top">
                        <span class="series-status ${statusClass}">${statusLabel}</span>
                        <span class="series-domain-icon">${work.icon}</span>
                    </div>
                    <h3 class="series-card-title">${work.title}</h3>
                </div>
                
                ${work.preview_image ? `
                    <div class="series-card-preview">
                        <img src="${work.preview_image}" alt="${work.title} preview" loading="lazy">
                    </div>
                ` : `
                    <div class="series-card-preview">
                        <span class="preview-placeholder">${work.icon}</span>
                    </div>
                `}
                
                <div class="series-card-body">
                    <p class="series-card-description">${work.description}</p>
                    
                    <div class="series-card-meta">
                        <span class="meta-item">
                            <span class="meta-icon">📅</span>
                            ${work.date}
                        </span>
                        ${work.metrics?.key_improvement ? `
                            <span class="meta-item">
                                <span class="meta-icon">📊</span>
                                ${work.metrics.key_improvement}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="series-card-footer">
                    <div class="series-card-links">
                        ${work.links.paper ? `
                            <a href="${work.links.paper}" class="card-link" target="_blank" rel="noopener">
                                📄 Paper
                            </a>
                        ` : `
                            <span class="card-link disabled">📄 Paper</span>
                        `}
                        ${work.links.code ? `
                            <a href="${work.links.code}" class="card-link" target="_blank" rel="noopener">
                                💻 Code
                            </a>
                        ` : `
                            <span class="card-link disabled">💻 Code</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="series-empty">
                <div class="series-empty-icon">🔍</div>
                <p>No works found in this category yet.</p>
            </div>
        `;
    }

    getStatusLabel(status) {
        const labels = {
            'published': '🎉 Published',
            'preprint': '📄 Preprint',
            'in-progress': '🚧 In Progress',
            'in_progress': '🚧 In Progress',
            'planned': '💡 Planned'
        };
        return labels[status] || status;
    }

    initFilters() {
        const filterButtons = document.querySelectorAll('.series-tab');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update filter and re-render
                this.currentFilter = button.dataset.filter || 'all';
                this.render();
            });
        });
    }

    // Public method to add a new work dynamically
    addWork(work) {
        this.works.push(work);
        this.render();
    }

    // Public method to update a work
    updateWork(id, updates) {
        const index = this.works.findIndex(work => work.id === id);
        if (index !== -1) {
            this.works[index] = { ...this.works[index], ...updates };
            this.render();
        }
    }

    // Public method to remove a work
    removeWork(id) {
        this.works = this.works.filter(work => work.id !== id);
        this.render();
    }
}

// Initialize SeriesManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const seriesGrid = document.getElementById('series-grid');
    if (seriesGrid) {
        window.seriesManager = new SeriesManager();
    }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeriesManager;
}
