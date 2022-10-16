<script lang="ts">
  import Panel from "./components/Panel.svelte";
  import {
    balance,
    entries,
    EntryTypes,
    incomingTotal,
    outgoingTotal,
  } from "./stores/entries";

  let descriptionInput = "";
  let valueInput = "";
  let typeInput = "";

  let descriptionFilter = "";
  let typeFilter = "";

  function addEntry() {
    if (typeInput === "") return;

    entries.update((oldEntries) => {
      const oldEntriesHandler = [...oldEntries];

      oldEntriesHandler.push({
        description: descriptionInput,
        value: Number(valueInput),
        type: Number(typeInput),
      });

      return oldEntriesHandler;
    });

    descriptionInput = "";
    valueInput = "";
    typeInput = "";
  }

  function removeEntry(index: number) {
    entries.update((oldEntries) => {
      const oldEntriesHandler = [...oldEntries];

      oldEntriesHandler.splice(index, 1);

      return oldEntriesHandler;
    });
  }

  $: filtredEntries = $entries.filter((entry) => {
    let filters = {
      description: true,
      type: true,
    };

    filters.description = entry.description
      .toLowerCase()
      .includes(descriptionFilter.toLowerCase());

    if (!!typeFilter) {
      filters.type = entry.type === Number(typeFilter);
    }

    return filters.description && filters.type;
  });
</script>

<main>
  <div class="panels">
    <Panel color="blue" label="Balance" value={$balance} />
    <Panel color="green" label="Total incoming" value={$incomingTotal} />
    <Panel color="red" label="Total outgoing" value={$outgoingTotal} />
  </div>
  <div class="add-panel">
    <input
      type="text"
      placeholder="Description"
      bind:value={descriptionInput}
    />
    <input type="number" placeholder="Value" bind:value={valueInput} />
    <select bind:value={typeInput}>
      <option value="">--- Select type ---</option>
      <option value="0">Incoming</option>
      <option value="1">Outgoing</option>
    </select>
    <button class="add-button" on:click={addEntry}>Add</button>
  </div>
  <div class="data-panel">
    <div class="filters">
      <span>Filters</span>
      <input
        type="text"
        placeholder="Description"
        bind:value={descriptionFilter}
      />
      <select bind:value={typeFilter}>
        <option value="">All types</option>
        <option value="0">Incoming</option>
        <option value="1">Outgoing</option>
      </select>
    </div>
    <table>
      <tr>
        <th />
        <th align="left">Description</th>
        <th align="left">Value ($)</th>
        <th />
      </tr>
      {#each filtredEntries as entry, index}
        <tr class="table-row">
          <td>
            {#if entry.type === EntryTypes.incoming}
              <box-icon type="solid" name="up-arrow-circle" color="#00a75a" />
            {:else}
              <box-icon type="solid" name="down-arrow-circle" color="#dd4c39" />
            {/if}
          </td>
          <td>{entry.description}</td>
          <td>{entry.value}</td>
          <td>
            <button on:click={() => removeEntry(index)}>
              <box-icon name="trash-alt" color="#dd4c39" />
            </button>
          </td>
        </tr>
      {/each}
    </table>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    padding: 50px;
  }

  .panels {
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 40px;
  }

  .add-panel {
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: whitesmoke;
    border-radius: 4px;
    padding: 10px;
  }

  input,
  select {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #d2d2d2;
    background-color: whitesmoke;
  }

  .add-panel .add-button {
    padding: 5px 20px;
    background-color: #00a75a;
    cursor: pointer;
    color: white;
    border-radius: 4px;
    border: none;
  }

  .data-panel {
    width: 100%;
    max-width: 800px;
    background-color: whitesmoke;
    border-radius: 4px;
    padding: 10px;
  }

  .data-panel .filters {
    padding-bottom: 20px;
  }

  .data-panel .filters *:nth-child(2) {
    margin-left: 10px;
  }

  table {
    width: 100%;
    max-width: 800px;
    border-radius: 4px;
    border-collapse: collapse;
  }

  td {
    border-top: 1px solid #d2d2d2;
  }

  table th:nth-child(1) {
    width: 1%;
    white-space: nowrap;
  }

  table th:nth-child(4) {
    width: 1%;
    white-space: nowrap;
  }

  th,
  td {
    padding: 5px 10px;
  }

  table .table-row button {
    padding: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
</style>
