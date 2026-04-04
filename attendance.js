var subjects = [];

// Show today's date in header
var today = new Date();
var dateStr = today.toDateString();
document.getElementById("headerDate").innerHTML = "<p style='font-size:13px; opacity:0.85;'>" + dateStr + "</p>";

// Load saved data from localStorage when page loads
if (localStorage.getItem("subjects_data") != null) {
    subjects = JSON.parse(localStorage.getItem("subjects_data"));
    renderCards();
}

function addSubject() {
    var name     = document.getElementById("subjectName").value.trim();
    var total    = parseInt(document.getElementById("totalClasses").value);
    var attended = parseInt(document.getElementById("attendedClasses").value);

    if (name == "") {
        alert("Please enter the subject name.");
        return;
    }
    if (isNaN(total) || total < 1) {
        alert("Please enter a valid number for total classes.");
        return;
    }
    if (isNaN(attended) || attended < 0) {
        alert("Please enter a valid number for attended classes.");
        return;
    }
    if (attended > total) {
        alert("Attended classes cannot be greater than total classes.");
        return;
    }

    var subjectObj = {
        name     : name,
        total    : total,
        attended : attended
    };

    subjects.push(subjectObj);
    saveToStorage();
    renderCards();

    document.getElementById("subjectName").value     = "";
    document.getElementById("totalClasses").value    = "";
    document.getElementById("attendedClasses").value = "";
}

function markPresent(index) {
    subjects[index].total    = subjects[index].total + 1;
    subjects[index].attended = subjects[index].attended + 1;
    saveToStorage();
    renderCards();
}

function markAbsent(index) {
    subjects[index].total = subjects[index].total + 1;
    saveToStorage();
    renderCards();
}

function deleteSubject(index) {
    var confirmDel = confirm("Are you sure you want to delete '" + subjects[index].name + "'?");
    if (confirmDel == true) {
        subjects.splice(index, 1);
        saveToStorage();
        renderCards();
    }
}

function calcPercent(attended, total) {
    if (total == 0) return 0;
    return Math.round((attended / total) * 100);
}

function classesNeeded(attended, total) {
    // calculates how many consecutive present classes needed to reach 75%
    var n = 0;
    var a = attended;
    var t = total;
    while (calcPercent(a, t) < 75 && n < 500) {
        a = a + 1;
        t = t + 1;
        n = n + 1;
    }
    return n;
}

function renderCards() {
    var section = document.getElementById("cardsSection");
    section.innerHTML = "";

    if (subjects.length == 0) {
        section.innerHTML = '<div class="empty-msg">No subjects added yet. Add a subject above to get started.</div>';
        document.getElementById("overallSection").style.display = "none";
        return;
    }

    var grandTotal    = 0;
    var grandAttended = 0;

    for (var i = 0; i < subjects.length; i++) {
        var s      = subjects[i];
        var pct    = calcPercent(s.attended, s.total);
        var missed = s.total - s.attended;

        grandTotal    = grandTotal    + s.total;
        grandAttended = grandAttended + s.attended;

        // Set colors based on percentage
        var pctColor   = pct >= 75 ? "#2e7d32" : "#c62828";
        var barColor   = pct >= 75 ? "#4caf50" : "#e53935";
        var cardClass  = pct >= 75 ? "card"    : "card low-attendance";

        // Warning message if below 75%
        var warningHTML = "";
        if (pct < 75) {
            var need = classesNeeded(s.attended, s.total);
            warningHTML = '<div class="warning-box">&#9888; Below 75% &mdash; Attend <b>' + need + '</b> more consecutive class(es) to recover.</div>';
        }

        // Build card HTML using string concatenation
        var cardHTML = "";
        cardHTML += '<div class="' + cardClass + '">';

        cardHTML += '<div class="card-header">';
        cardHTML += '<h3>' + s.name + '</h3>';
        cardHTML += '<span class="percentage-badge" style="color:' + pctColor + '">' + pct + '%</span>';
        cardHTML += '</div>';

        cardHTML += '<div class="card-stats">';
        cardHTML += '<div class="stat-box"><div class="stat-num">' + s.attended + '</div><div class="stat-label">Attended</div></div>';
        cardHTML += '<div class="stat-box"><div class="stat-num">' + s.total    + '</div><div class="stat-label">Total</div></div>';
        cardHTML += '<div class="stat-box"><div class="stat-num">' + missed     + '</div><div class="stat-label">Missed</div></div>';
        cardHTML += '</div>';

        cardHTML += '<div class="progress-bar-bg">';
        cardHTML += '<div class="progress-bar-fill" style="width:' + pct + '%; background-color:' + barColor + '"></div>';
        cardHTML += '</div>';

        cardHTML += warningHTML;

        cardHTML += '<div class="card-actions">';
        cardHTML += '<button class="btn-present" onclick="markPresent(' + i + ')">&#10003; Present</button>';
        cardHTML += '<button class="btn-absent"  onclick="markAbsent('  + i + ')">&#10007; Absent</button>';
        cardHTML += '<button class="btn-delete"  onclick="deleteSubject(' + i + ')">Delete</button>';
        cardHTML += '</div>';

        cardHTML += '</div>';

        section.innerHTML = section.innerHTML + cardHTML;
    }

    // Update overall attendance section
    var overallPct    = calcPercent(grandAttended, grandTotal);
    var overallColor  = overallPct >= 75 ? "#2e7d32"  : "#c62828";
    var overallBorder = overallPct >= 75 ? "#1a73e8"  : "#e53935";

    var overallSection = document.getElementById("overallSection");
    overallSection.style.display     = "flex";
    overallSection.style.borderColor = overallBorder;

    document.getElementById("overallPct").innerHTML    = '<span style="color:' + overallColor + '">' + overallPct + '%</span>';
    document.getElementById("overallDetail").innerHTML = grandAttended + " classes attended out of " + grandTotal;
}

function saveToStorage() {
    localStorage.setItem("subjects_data", JSON.stringify(subjects));
}
