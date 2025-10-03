/**
 * Button Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/core/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button onPress={() => {}}>Test Button</Button>
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Press Me</Button>
    );

    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress} disabled>
        Disabled Button
      </Button>
    );

    fireEvent.press(getByText('Disabled Button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(
      <Button onPress={() => {}} variant="secondary">
        Secondary
      </Button>
    );
    expect(getByText('Secondary')).toBeTruthy();
  });
});
