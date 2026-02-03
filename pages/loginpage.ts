import { Page, Locator } from '@playwright/test';
import { BasePage } from './basepage';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByTestId('email-input')
      .or(this.page.getByRole('textbox', { name: /email/i }))
      .or(this.page.getByPlaceholder('eg: example@mail.com'));
    this.passwordInput = this.page.getByTestId('password-input')
      .or(this.page.getByRole('textbox', { name: /password/i }))
      .or(this.page.getByPlaceholder('＊＊＊＊＊＊＊＊'));
    this.rememberMeCheckbox = this.page.getByTestId('remember-me-checkbox').or(this.page.locator('#checked'));
    this.loginButton = this.page.getByTestId('login-button')
      .or(this.page.getByRole('button', { name: 'Login', exact: true }))
      .or(this.page.locator("button.button:has-text('Login')"));
  }

  async openApplication(): Promise<void> {
    await this.navigateTo('https://auth.uat.pluginlive.com/', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.safeFill(this.emailInput, email, 'Email input');
    await this.safeFill(this.passwordInput, password, 'Password input', { validate: false });
    await this.safeClick(this.rememberMeCheckbox, 'Remember me checkbox');
    await this.safeClick(this.loginButton, 'Login button');
    await this.waitForNavigation();
  }
}
