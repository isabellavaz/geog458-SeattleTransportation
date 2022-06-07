'use strict';

(function() {
    const qs = document.querySelector.bind(document);
    const id = document.getElementById.bind(document);
    const qsa = document.querySelectorAll.bind(document);

    window.addEventListener('load', init);

    /**
     * Runs when the page first loads. Sets up the navigation buttons to show the appropriate pages.
     */
    function init() {
        qsa('nav button').forEach(el => el.addEventListener('click', showPage));
    }

    /**
     * Shows the section for the clicked on button. The this keyword is expected to be bound to a
     * nav button.
     */
    function showPage() {
        const sections = qsa('main > section');
        console.log(sections);
        for (const section of sections) {
            if (section.id === this.dataset.target) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
        qsa('nav button.selected').forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
    }
})();
