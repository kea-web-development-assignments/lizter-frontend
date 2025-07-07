<script>
    export let text = 'Submit';
    export let addToStyle = '';
</script>

<input
    class={"w-full bg-primary text-white rounded-full cursor-pointer p-2 ".concat(addToStyle)}
    type="submit"
    value={text}
>
