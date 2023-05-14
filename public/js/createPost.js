let count = 0;

function addStep() {
    count += 1;

    const label = document.createElement("label");
    label.for = "step" + count;
    label.innerHTML = "Schritt: " + count;

    const textarea = document.createElement("textarea");
    textarea.className = "textInput stepDescription";
    textarea.id = "step" + count;
    textarea.name = "step" + count;
    textarea.placeholder = "Erklärung für Schritt " + count + ". ...";

    const div = document.createElement("div");
    div.id = count;
    div.className = "inputGroup";
    document.getElementById("stepsContainer");
    div.appendChild(label);
    div.appendChild(textarea);

    const container = document.getElementById("stepsContainer");
    container.appendChild(div);
}

function removeStep() {
    if (count > 1) {
        let step = document.getElementById(count);
        step.remove();
        count -= 1;
    }
}