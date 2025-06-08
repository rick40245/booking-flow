import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PageContainer from '../PageContainer.vue'; // Adjust path as needed

describe('PageContainer.vue', () => {
  describe('title prop', () => {
    it('should render title when title prop is provided', () => {
      const titleText = 'Test Title';
      const wrapper = mount(PageContainer, {
        props: {
          title: titleText,
        },
      });
      const titleElement = wrapper.find('h1');
      expect(titleElement.exists()).toBe(true);
      expect(titleElement.text()).toBe(titleText);
    });

    it('should not render title when title prop is not provided', () => {
      const wrapper = mount(PageContainer);
      const titleElement = wrapper.find('h1');
      expect(titleElement.exists()).toBe(false);
    });
  });

  describe('maxWidth prop', () => {
    // Helper function to get the specific div that contains the maxWidth classes
    const getContainerDiv = (wrapper: ReturnType<typeof mount>) => {
      // The maxWidth classes are on the inner div with bg-white class
      return wrapper.find('.bg-white');
    };

    it('should apply default maxWidth class (md) when maxWidth prop is not provided', () => {
      const wrapper = mount(PageContainer);
      const containerDiv = getContainerDiv(wrapper);
      expect(containerDiv.classes()).toContain('md:max-w-120');
      expect(containerDiv.classes()).toContain('md:w-120');
    });

    it('should apply correct class for maxWidth="sm"', () => {
      const wrapper = mount(PageContainer, {
        props: {
          maxWidth: 'sm',
        },
      });
      const containerDiv = getContainerDiv(wrapper);
      expect(containerDiv.classes()).toContain('md:max-w-100');
      expect(containerDiv.classes()).toContain('md:w-100');
    });

    it('should apply correct class for maxWidth="md"', () => {
      const wrapper = mount(PageContainer, {
        props: {
          maxWidth: 'md',
        },
      });
      const containerDiv = getContainerDiv(wrapper);
      expect(containerDiv.classes()).toContain('md:max-w-120');
      expect(containerDiv.classes()).toContain('md:w-120');
    });

    it('should apply correct class for maxWidth="lg"', () => {
      const wrapper = mount(PageContainer, {
        props: {
          maxWidth: 'lg',
        },
      });
      const containerDiv = getContainerDiv(wrapper);
      expect(containerDiv.classes()).toContain('md:max-w-130');
      expect(containerDiv.classes()).toContain('md:w-130');
    });
  });

  describe('default slot', () => {
    it('should render default slot content', () => {
      const slotContentText = 'Hello Slot Content';
      const wrapper = mount(PageContainer, {
        slots: {
          default: `<span id="slot-content">${slotContentText}</span>`,
        },
      });
      const slotElement = wrapper.find('#slot-content');
      expect(slotElement.exists()).toBe(true);
      expect(slotElement.text()).toBe(slotContentText);
    });

    it('should render empty slot if no content provided', () => {
        const wrapper = mount(PageContainer);
        // The slot is inside the inner div with bg-white class
        const containerDiv = wrapper.find('.bg-white');
        expect(containerDiv.text()).toBe('');
      });
  });
});
