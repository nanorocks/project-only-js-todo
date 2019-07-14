$(document).ready(function () {

    Storage.prototype.setObject = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.getObject = function (key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    };

    // Format date
    function formatDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        date = dd + '-' + mm + '-' + yyyy;
        return date
    }

    // Get array from last 3 days.
    function last3Days() {
        var result = [];
        for (var i = 0; i < 3; i++) {

            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(formatDate(d))
        }

        return (result);
    }


    // Return today date
    function dateNow() {
        let date = new Date();
        return formatDate(date);
    }

    // Load all tasks
    function loadTasks() {

        $('#chart').html('');

        let view = $('#content-task-data');
        let content = '';
        let tasks = localStorage.getObject('tasks');
        tasks = (tasks == null) ? {} : tasks;
        let len = Object.keys(tasks).length;

        // clear view

        if (len <= 0) {
            content = `<h5 class="text-center p-3 text-justify bg-light">No todo's in list for today.</h5>`;
            view.html(content);
            return -1;
        }

        let days = last3Days();
        let countOne, countTwo, countThree;
        countOne = countTwo = countThree = 0;

        for(let i = 0; i < len; i++)
        {
            let dateTask = tasks[i].date;

            console.log(days[0], dateTask);
            if (days[0] === dateTask) {
                countOne++;
            } else if (days[1] === dateTask) {
                countTwo++;
            } else if (days[2] === dateTask) {
                countThree++;
            }
        }

        for (let i = 0; i < len; i++) {

            if(tasks[i].date !== dateNow())
            {
                continue;
            }

            let checkTask = tasks[i].check;
            let dateTask = tasks[i].date;
            let nameTask = tasks[i].name;

            content += `  
                    <tr>
                        <th scope="row" class="border-top-0 align-middle">
                            <strong>${i + 1}</strong>
                        </th>
                        <td class="border-top-0 align-middle">
                            <span class="${checkTask}" data-bind-date="${dateTask}" id="task-name">${nameTask}</span>
                        </td>
                        <td class="text-right border-top-0">
                            <div class="btn-group m-0" role="group">
                                <button type="button" class="btn btn-outline-dark btn-sm m-1 check-task-btn">&#10004;</button>
                                <button type="button" class="btn btn-outline-dark btn-sm m-1 delete-task-btn">&#10006;</button>
                            </div>
                        </td>
                    </tr>
                    `;
        }

        if (content === '') {
            content = `<h5 class="text-center p-3 text-justify bg-light">No todo's in list for today.</h5>`;
            view.html(content);
            return -1;
        }

        view.html(content);

        var options = {
            chart: {
                type: 'bar'
            },
            series: [{
                name: 'Tasks from Todo List',
                data: [countOne, countTwo, countThree],
                colors: ['rgb(250, 162, 28)']
            }],
            xaxis: {
                categories: last3Days()
            },
            fill: {
                colors: ['rgb(250, 162, 28)']
            }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

    }

    // Add task to task list
    $('#task-add-btn').on('click', function (e) {

        let input = $('#task-add-input');
        let taskName = input.val();

        if (taskName.trim().length <= 0) {
            input.attr('placeholder', 'Enter valid todo!!!');
            input.val('');
            return -1;
        }

        input.val('');

        let taskDate = dateNow();
        let taskCheck = 'line-through-none';

        let task = {
            'name': taskName,
            'date': taskDate,
            'check': taskCheck
        };

        let data = localStorage.getObject('tasks');

        if (data == null) {
            localStorage.setObject('tasks', []);
            data = localStorage.getObject('tasks');
        }

        data.push(task);
        localStorage.setObject('tasks', data);

        loadTasks();
    });

    $(document).on('click', '.delete-task-btn', function () {

        let span = $(this).parent().parent().parent().find('span');
        let ind = parseInt($(this).parent().parent().parent().find('strong').text()) - 1;

        let data = localStorage.getObject('tasks');

        data.splice(ind, 1);
        localStorage.setObject('tasks', data);

        loadTasks();
    });


    $(document).on('click', '.check-task-btn', function () {

        let span = $(this).parent().parent().parent().find('span');
        let ind = parseInt($(this).parent().parent().parent().find('strong').text()) - 1;

        let data = localStorage.getObject('tasks');

        if (span.attr('class') === 'line-through') {
            span.removeClass('line-through');
            span.addClass('line-through-none');
            data[ind].check = 'line-through-none';
        } else {
            span.removeClass('line-through-none');
            span.addClass('line-through');
            data[ind].check = 'line-through';
        }

        localStorage.setObject('tasks', data);
    });

    // Clear history data
    $(document).on('click', '#task-clear-history-btn', function () {

        let msg = confirm('Are you sure ? ');

        if (!msg) {
            return -1;
        }

        localStorage.setObject('tasks', []);
        loadTasks();
    });

    // On page load load all tasks
    loadTasks();
});
