### **2. Test Scenarios**

#### **Login Page**

1. Verify successful login with valid credentials.
2. Verify error message for invalid credentials.
3. Verify CAPTCHA or MFA is triggered after multiple failed login attempts.


#### **Dashboard Page**

1. Verify the dashboard loads successfully after login.
2. Verify the list of repositories is displayed.
3. Verify the "Create Repository" button opens the repository creation form.
4. Verify a new repository is created and appears on the dashboard.
5. Verify the logout button redirects to the login page.

#### **Repository Page**

1. Verify the repository page loads successfully.
2. Verify the "Create Issue" button opens the issue creation form.
3. Verify a new issue is created and appears in the repository.
4. Verify the repository name and owner are displayed correctly.

#### **Edge Cases**

1. Verify behavior when creating a repository with an existing name.
2. Verify behavior when creating an issue with an empty title.
3. Verify behavior when logging out mid-action (e.g., while creating a repository or issue).

---

### **3. Discussion Questions**

1. **CAPTCHA/MFA Handling in Automation:**

   - How should CAPTCHA or MFA be handled in automated tests? Should we mock these features or disable them in the test environment?

2. **Repository Name Uniqueness:**

   - What happens if a user tries to create a repository with a name that already exists? Should the system enforce uniqueness, and if so, how?

3. **Issue Creation Validation:**

   - Are there any validation rules for issue titles (e.g., minimum/maximum length, special characters)? How should these be tested?

4. **Concurrency Testing:**

   - How does the system handle multiple users creating repositories or issues simultaneously? Should we include concurrency testing in our automation suite?

5. **Error Handling:**

   - How are errors (e.g., network issues, server errors) handled during repository or issue creation? Are users provided with meaningful error messages?

6. **Performance Testing:**

   - Should we include performance testing for the dashboard page, especially when a user has a large number of repositories?

7. **Access Control:**
   - Are there different user roles (e.g., admin, contributor) with varying permissions? How should these roles be tested?

8. **Forgot Password Link**
   - Should there be a link to reset the password for the user, named 'Forgot Password', if the attempted passwords are wrong.
