class WeeksLeftCalculator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <p>
        <label for="birthday">I was born on</label>
        <input type="date" id="birthday" name="birthday" value="2001-01-01">.
        
        <label for="age">If I live to</label>
        <input type="number" id="age" name="age" value="74">
        <br />
        <div id="weeks-left-output"></div>
        <label for="secondDate">until:</label>
        <input type="date" id="secondDate" name="secondDate" value="2066-01-01">
        </p>
      `;

    // Select the input elements
    const birthdayInput = this.querySelector("#birthday");
    const ageInput = this.querySelector("#age");
    const secondDate = this.querySelector("#secondDate");

    // Add event listeners
    birthdayInput.addEventListener("change", this.updateOutput.bind(this));
    ageInput.addEventListener("input", this.updateOutput.bind(this));
    secondDate.addEventListener("input", this.updateOutput.bind(this));

    this.updateOutput();
  }

  // Method to update the display output
  updateOutput() {
    const birthday = this.querySelector("#birthday").value;
    const targetAge = parseInt(this.querySelector("#age").value);
    const secondTarget = this.querySelector("#secondDate").value;

    const birthdayDate = new Date(birthday);
    const targetDate = new Date(birthdayDate);
    const secondTargetDate = new Date(secondTarget);

    targetDate.setFullYear(birthdayDate.getFullYear() + targetAge);

    const weeksLeft = this.calculateWeeksLeft(targetDate);
    const weeksLeftUntilSecondDate = this.calculateWeeksLeft(secondTargetDate);
    const message = `I have about ${weeksLeft} weeks left left, or ${weeksLeftUntilSecondDate} weeks`;
    this.querySelector("#weeks-left-output").textContent = message;
  }

  // Method that calculates the weeks left
  calculateWeeksLeft(targetDate) {
    const today = new Date();

    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLeft = Math.floor((targetDate - today) / millisecondsPerWeek);
    return weeksLeft;
  }
}

customElements.define("weeks-left", WeeksLeftCalculator);
