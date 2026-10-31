/**
 * Selector de opciones accesible implementado como grupo de radio buttons con aspecto de "chips".
 */
export default function OptionSelector({ label, name, options, value, onChange }) {
  return (
    <fieldset className="option-selector">
      <legend className="option-selector__legend">{label}</legend>
      {options.length === 0 ? (
        <p className="option-selector__empty">No hay opciones disponibles</p>
      ) : (
        <div className="option-selector__options">
          {options.map((option) => {
            const id = `${name}-${option.code}`;
            return (
              <label
                key={option.code}
                htmlFor={id}
                className={`option-selector__option${value === option.code ? ' is-selected' : ''}`}
              >
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={option.code}
                  checked={value === option.code}
                  onChange={() => onChange(option.code)}
                  className="visually-hidden"
                />
                {option.name}
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
